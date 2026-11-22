import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("multiplayer lobby enforces host, membership, capacity and start rules", async () => {
  const db = new PGlite();
  const host = "11111111-1111-4111-8111-111111111111";
  const guest = "22222222-2222-4222-8222-222222222222";
  const outsider = "33333333-3333-4333-8333-333333333333";
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      grant usage on schema auth, public to anon, authenticated;
      create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}', email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb) $$;
      grant execute on function auth.uid(), auth.jwt() to authenticated;
      create publication supabase_realtime;`);
    await db.exec(await readFile(new URL("../supabase/migrations/202609290001_membership.sql", import.meta.url), "utf8"));
    await db.exec(await readFile(new URL("../supabase/migrations/202610150001_multiplayer_lobby.sql", import.meta.url), "utf8"));
    await db.query("insert into auth.users(id,email_confirmed_at) values ($1,now()),($2,null),($3,now())", [host, guest, outsider]);

    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${guest}', false); select set_config('request.jwt.claims', '{"is_anonymous":true}', false);`);
    await assert.rejects(db.query("select * from public.create_multiplayer_room('Misafir')"));
    await db.exec(`select set_config('request.jwt.claim.sub', '${host}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    const created = (await db.query<{ room_id: string; room_code: string }>("select * from public.create_multiplayer_room('Sunucu')")).rows[0]!;
    assert.match(created.room_code, /^[A-F0-9]{6}$/);
    assert.equal((await db.query("select * from public.multiplayer_rooms")).rows.length, 1);
    await assert.rejects(db.query("select public.start_multiplayer_room($1)", [created.room_id]));

    await db.exec(`select set_config('request.jwt.claim.sub', '${outsider}', false);`);
    assert.equal((await db.query("select * from public.multiplayer_rooms")).rows.length, 0);
    assert.equal((await db.query("select * from public.multiplayer_participants")).rows.length, 0);
    await assert.rejects(db.query("select public.join_multiplayer_room('FFFFFF','Yabancı')"));
    await assert.rejects(db.query("select public.start_multiplayer_room($1)", [created.room_id]));
    await assert.rejects(db.query("insert into public.multiplayer_participants(room_id,user_id,nickname) values ($1,$2,'Hile')", [created.room_id, outsider]));

    await db.exec(`select set_config('request.jwt.claim.sub', '${guest}', false); select set_config('request.jwt.claims', '{"is_anonymous":true}', false);`);
    assert.equal((await db.query<{ join_multiplayer_room: string }>("select public.join_multiplayer_room($1,'Arkadaş')", [created.room_code.toLowerCase()])).rows[0]!.join_multiplayer_room, created.room_id);
    assert.equal((await db.query("select * from public.multiplayer_participants")).rows.length, 2);
    await assert.rejects(db.query("select public.start_multiplayer_room($1)", [created.room_id]));

    await db.exec("reset role;");
    const extraUsers = Array.from({ length: 7 }, (_, index) => `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`);
    for (const id of extraUsers) await db.query("insert into auth.users(id) values ($1)", [id]);
    await db.exec("set role authenticated;");
    for (const [index, id] of extraUsers.entries()) {
      await db.exec(`select set_config('request.jwt.claim.sub', '${id}', false);`);
      if (index < 6) await db.query("select public.join_multiplayer_room($1,$2)", [created.room_code, `Oyuncu${index + 1}`]);
      else await assert.rejects(db.query("select public.join_multiplayer_room($1,'Dokuzuncu')", [created.room_code]));
    }
    assert.equal((await db.query("select * from public.multiplayer_participants")).rows.length, 0);
    await db.exec("reset role;");
    assert.equal((await db.query("select * from public.multiplayer_participants where room_id=$1", [created.room_id])).rows.length, 8);

    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${host}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    const started = (await db.query<{ start_multiplayer_room: Date }>("select public.start_multiplayer_room($1)", [created.room_id])).rows[0]!;
    assert.ok(new Date(started.start_multiplayer_room).getTime() > Date.now());
    assert.equal((await db.query<{ status: string }>("select status from public.multiplayer_rooms where id=$1", [created.room_id])).rows[0]!.status, "started");
    await db.exec(`select set_config('request.jwt.claim.sub', '${outsider}', false);`);
    await assert.rejects(db.query("select public.join_multiplayer_room($1,'Geç Kaldım')", [created.room_code]));

    await db.exec("reset role;");
    await db.query("delete from auth.users where id=$1", [host]);
    assert.equal((await db.query("select * from public.multiplayer_rooms")).rows.length, 0);
    assert.equal((await db.query("select * from public.multiplayer_participants")).rows.length, 0);
  } finally { await db.close(); }
});

test("any room member may advance and rematch, while outsiders remain blocked", async () => {
  const db = new PGlite();
  const host = "41111111-1111-4111-8111-111111111111";
  const guest = "42222222-2222-4222-8222-222222222222";
  const outsider = "43333333-3333-4333-8333-333333333333";
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      grant usage on schema auth, public to anon, authenticated;
      create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}', email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb) $$;
      grant execute on function auth.uid(), auth.jwt() to authenticated;
      create publication supabase_realtime;`);
    for (const path of [
      "../supabase/migrations/202609290001_membership.sql",
      "../supabase/migrations/202610150001_multiplayer_lobby.sql",
      "../supabase/migrations/202610150002_multiplayer_game.sql",
      "../supabase/migrations/202610150003_multiplayer_rematch.sql",
      "../supabase/migrations/202610150004_multiplayer_participant_controls.sql",
      "../supabase/migrations/202610150005_multiplayer_leave_room.sql",
      "../supabase/migrations/202610160006_multiplayer_answer_recovery.sql",
    ]) await db.exec(await readFile(new URL(path, import.meta.url), "utf8"));
    await db.query("insert into auth.users(id,email_confirmed_at) values ($1,now()),($2,null),($3,now())", [host, guest, outsider]);

    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${host}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    const room = (await db.query<{ room_id: string; room_code: string }>("select * from public.create_multiplayer_room('Host')")).rows[0]!;
    await db.exec(`select set_config('request.jwt.claim.sub', '${guest}', false); select set_config('request.jwt.claims', '{"is_anonymous":true}', false);`);
    await db.query("select public.join_multiplayer_room($1,'Oyuncu')", [room.room_code]);
    const questionIds = Array.from({ length: 10 }, (_, index) => `question-${index}`);
    await db.exec(`select set_config('request.jwt.claim.sub', '${host}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    await db.query("select public.start_multiplayer_game($1,$2,123)", [room.room_id, questionIds]);
    await db.exec("reset role;");
    await db.query("update public.multiplayer_rooms set question_started_at=now() - interval '1 second' where id=$1", [room.room_id]);
    await db.exec("set role authenticated;");
    await db.exec(`select set_config('request.jwt.claim.sub', '${outsider}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    await assert.rejects(db.query("select public.advance_multiplayer_question($1,0)", [room.room_id]), /Room participant required/);

    await db.exec("reset role;");
    await db.query(`insert into public.multiplayer_round_answers(room_id,question_index,user_id,is_correct,points)
      values ($1,0,$2,true,100),($1,0,$3,false,0)`, [room.room_id, host, guest]);
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${guest}', false); select set_config('request.jwt.claims', '{"is_anonymous":true}', false);`);
    const advanced = await db.query<{ next_question_index: number }>("select * from public.advance_multiplayer_question($1,0)", [room.room_id]);
    assert.equal(advanced.rows[0]!.next_question_index, 1);

    await db.exec("reset role;");
    await db.query("update public.multiplayer_rooms set status='closed' where id=$1", [room.room_id]);
    await db.exec("set role authenticated;");
    await db.exec(`select set_config('request.jwt.claim.sub', '${outsider}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    await assert.rejects(db.query("select public.rematch_multiplayer_game($1,$2,456)", [room.room_id, questionIds]), /Room participant required/);

    await db.exec(`select set_config('request.jwt.claim.sub', '${guest}', false); select set_config('request.jwt.claims', '{"is_anonymous":true}', false);`);
    await db.query("select public.rematch_multiplayer_game($1,$2,456)", [room.room_id, questionIds.map((id, index) => `${id}-next-${index}`)]);
    const rematched = (await db.query<{ status: string; question_index: number; question_seed: number }>(
      "select status,question_index,question_seed from public.multiplayer_rooms where id=$1", [room.room_id],
    )).rows[0]!;
    assert.deepEqual(rematched, { status: "started", question_index: 0, question_seed: 456 });
    await db.exec("reset role;");
    assert.equal((await db.query("select * from public.multiplayer_round_answers where room_id=$1", [room.room_id])).rows.length, 0);

    await db.query("update public.multiplayer_rooms set question_started_at=now() - interval '1 second' where id=$1", [room.room_id]);
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${guest}', false); select set_config('request.jwt.claims', '{"is_anonymous":true}', false);`);
    await db.query("select public.submit_multiplayer_answer_v2($1,0,true,100,'choice-b')", [room.room_id]);
    const ownAnswer = (await db.query<{ is_correct: boolean; points: number; selected_id: string }>(
      "select * from public.get_my_multiplayer_answer($1,0)", [room.room_id],
    )).rows[0]!;
    assert.deepEqual(ownAnswer, { is_correct: true, points: 100, selected_id: "choice-b" });
    await db.exec(`select set_config('request.jwt.claim.sub', '${outsider}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    await assert.rejects(db.query("select * from public.get_my_multiplayer_answer($1,0)", [room.room_id]), /Room unavailable/);

    await db.exec("reset role;");
    await db.query("insert into public.multiplayer_round_answers(room_id,question_index,user_id,is_correct,points) values ($1,0,$2,true,100)", [room.room_id, host]);
    await db.query("update public.multiplayer_rooms set status='waiting' where id=$1", [room.room_id]);
    await db.exec("set role authenticated;");
    await db.exec(`select set_config('request.jwt.claim.sub', '${host}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    await db.query("select public.leave_multiplayer_room($1)", [room.room_id]);
    await db.exec("reset role;");
    assert.equal((await db.query<{ host_user_id: string }>("select host_user_id from public.multiplayer_rooms where id=$1", [room.room_id])).rows[0]!.host_user_id, guest);
    assert.equal((await db.query<{ user_id: string }>("select user_id from public.multiplayer_round_answers where room_id=$1", [room.room_id])).rows.length, 1);

    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${outsider}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    await db.query("select public.join_multiplayer_room($1,'Üçüncü')", [room.room_code]);
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${guest}', false); select set_config('request.jwt.claims', '{"is_anonymous":true}', false);`);
    await db.query("select public.start_multiplayer_game($1,$2,789)", [room.room_id, questionIds.map(id => `${id}-host-handoff`)]);
    await db.query("select public.leave_multiplayer_room($1)", [room.room_id]);
    await db.exec("reset role;");
    assert.equal((await db.query<{ host_user_id: string }>("select host_user_id from public.multiplayer_rooms where id=$1", [room.room_id])).rows[0]!.host_user_id, outsider);
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${outsider}', false); select set_config('request.jwt.claims', '{"is_anonymous":false}', false);`);
    await db.query("select public.leave_multiplayer_room($1)", [room.room_id]);
    await db.exec("reset role;");
    assert.equal((await db.query("select * from public.multiplayer_rooms where id=$1", [room.room_id])).rows.length, 0);
  } finally { await db.close(); }
});
