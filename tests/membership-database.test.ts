import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("PostgreSQL membership migration enforces RLS, ownership, maxima and deletion cascades", async () => {
  const db = new PGlite();
  const one = "11111111-1111-4111-8111-111111111111", two = "22222222-2222-4222-8222-222222222222", unverified = "33333333-3333-4333-8333-333333333333";
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      grant usage on schema auth, public to anon, authenticated;
      create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}', email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant execute on function auth.uid() to anon, authenticated;`);
    await db.exec(await readFile(new URL("../supabase/migrations/202609290001_membership.sql", import.meta.url), "utf8"));
    await db.query("insert into auth.users(id,raw_user_meta_data,email_confirmed_at) values ($1,$2,now()),($3,$4,now()),($5,'{}',null)", [one, '{"nickname":"Meraklı"}', two, '{"nickname":"Other"}', unverified]);
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${one}', false);`);
    assert.deepEqual((await db.query("select nickname from public.profiles")).rows, [{ nickname: "Meraklı" }]);
    assert.equal((await db.query("update public.profiles set nickname='Stolen' where id=$1 returning id", [two])).rows.length, 0);
    await assert.rejects(db.query("insert into public.profiles(id,nickname) values ($1,'Stolen')", [two]));
    await assert.rejects(db.query("select * from public.save_personal_best($1,'mixed','easy',800)", [two]));
    await db.query("select * from public.save_personal_best($1,'mixed','easy',800)", [one]);
    assert.deepEqual((await db.query("select * from public.save_personal_best($1,'mixed','easy',100)", [one])).rows, [{ category: "mixed", difficulty: "easy", score: 800 }]);
    for (const score of [-1, 2001]) await assert.rejects(db.query("select * from public.save_personal_best($1,'mixed','easy',$2)", [one, score]));
    await assert.rejects(db.query("select * from public.save_personal_best($1,'fake','easy',100)", [one]));
    await assert.rejects(db.query("insert into public.personal_bests(user_id,category,difficulty,score) values ($1,'mixed','easy',999)", [one]));
    await db.exec(`select set_config('request.jwt.claim.sub', '${two}', false);`);
    assert.deepEqual((await db.query("select * from public.personal_bests")).rows, []);
    await db.query("select * from public.save_personal_best($1,'space','hard',500)", [two]);
    await db.exec(`select set_config('request.jwt.claim.sub', '${unverified}', false);`);
    await assert.rejects(db.query("select * from public.save_personal_best($1,'mixed','easy',100)", [unverified]));
    await db.exec("reset role; set role anon; select set_config('request.jwt.claim.sub', '', false);");
    await assert.rejects(db.query("select * from public.profiles"));
    await assert.rejects(db.query("select * from public.personal_bests"));
    await assert.rejects(db.query("select * from public.save_personal_best($1,'mixed','easy',100)", [one]));
    await db.exec("reset role;");
    await db.query("delete from auth.users where id=$1", [one]);
    assert.deepEqual((await db.query("select * from public.profiles where id=$1", [one])).rows, []);
    assert.deepEqual((await db.query("select * from public.personal_bests where user_id=$1", [one])).rows, []);
    assert.equal((await db.query("select * from public.personal_bests where user_id=$1", [two])).rows.length, 1);
  } finally { await db.close(); }
});

test("category migration keeps old cloud records and accepts distinct new History", async () => {
  const db = new PGlite();
  const owner = "11111111-1111-4111-8111-111111111111";
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      grant usage on schema auth, public to anon, authenticated;
      create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}', email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant execute on function auth.uid() to anon, authenticated;`);
    await db.exec(await readFile(new URL("../supabase/migrations/202609290001_membership.sql", import.meta.url), "utf8"));
    await db.query("insert into auth.users(id,email_confirmed_at) values ($1,now())", [owner]);
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${owner}', false);`);
    await db.query("select * from public.save_personal_best($1,'history','easy',900)", [owner]);
    await db.exec("reset role;");
    await db.exec(await readFile(new URL("../supabase/migrations/202609300001_categories.sql", import.meta.url), "utf8"));
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${owner}', false);`);
    await db.query("select * from public.save_personal_best($1,'history_v2','easy',500)", [owner]);
    await db.query("select * from public.save_personal_best($1,'sports','easy',300)", [owner]);
    const rows = (await db.query<{ category: string; score: number }>("select category,score from public.personal_bests order by category")).rows;
    assert.deepEqual(rows, [{ category: "history", score: 900 }, { category: "history_v2", score: 500 }, { category: "sports", score: 300 }]);
    await assert.rejects(db.query("select * from public.save_personal_best($1,'fake','easy',100)", [owner]));
  } finally { await db.close(); }
});

test("knowledge profile rounds are private, removable and cascade on account deletion", async () => {
  const db = new PGlite();
  const one = "11111111-1111-4111-8111-111111111111", two = "22222222-2222-4222-8222-222222222222";
  const roundId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      grant usage on schema auth, public to anon, authenticated;
      create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}', email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant execute on function auth.uid() to anon, authenticated;`);
    await db.exec(await readFile(new URL("../supabase/migrations/202609290001_membership.sql", import.meta.url), "utf8"));
    await db.exec(await readFile(new URL("../supabase/migrations/202609300002_knowledge_profile.sql", import.meta.url), "utf8"));
    await db.query("insert into auth.users(id,email_confirmed_at) values ($1,now()),($2,now())", [one, two]);
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${one}', false);`);
    await db.query("insert into public.knowledge_rounds(id,user_id,completed_at,answers) values ($1,$2,now(),$3)", [roundId, one, '[{"questionId":"e01","correct":true}]']);
    await db.query("select public.clear_knowledge_profile()");
    assert.equal((await db.query("select * from public.knowledge_rounds")).rows.length, 0);
    await assert.rejects(db.query("insert into public.knowledge_rounds(id,user_id,completed_at,answers) values ($1,$2,'2026-01-01', $3)", [roundId, one, '[{"questionId":"e01","correct":true}]']));
    await db.query("insert into public.knowledge_rounds(id,user_id,completed_at,answers) values ($1,$2,now() + interval '1 second',$3)", [roundId, one, '[{"questionId":"e01","correct":true}]']);
    await assert.rejects(db.query("insert into public.knowledge_rounds(id,user_id,completed_at,answers) values (gen_random_uuid(),$1,now(),$2)", [two, '[{"questionId":"e01","correct":true}]']));
    await db.exec(`select set_config('request.jwt.claim.sub', '${two}', false);`);
    assert.equal((await db.query("select * from public.knowledge_rounds")).rows.length, 0);
    assert.equal((await db.query("delete from public.knowledge_rounds where id=$1 returning id", [roundId])).rows.length, 0);
    await db.exec("reset role; set role anon;");
    await assert.rejects(db.query("select * from public.knowledge_rounds"));
    await db.exec("reset role;");
    await db.query("delete from auth.users where id=$1", [one]);
    assert.equal((await db.query("select * from public.knowledge_rounds")).rows.length, 0);
  } finally { await db.close(); }
});
