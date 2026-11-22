begin;

alter table public.multiplayer_rooms
  add column if not exists question_ids text[],
  add column if not exists question_seed integer,
  add column if not exists question_index integer not null default 0 check (question_index between 0 and 9),
  add column if not exists question_started_at timestamptz;

create table if not exists public.multiplayer_round_answers (
  room_id uuid not null references public.multiplayer_rooms(id) on delete cascade,
  question_index integer not null check (question_index between 0 and 9),
  user_id uuid not null references auth.users(id) on delete cascade,
  is_correct boolean not null,
  points integer not null check (points between 0 and 200),
  answered_at timestamptz not null default now(),
  primary key (room_id, question_index, user_id)
);

alter table public.multiplayer_round_answers enable row level security;
revoke all on public.multiplayer_round_answers from public, anon, authenticated;
revoke all on function public.start_multiplayer_room(uuid) from public, anon, authenticated;

create or replace function public.start_multiplayer_game(p_room_id uuid, p_question_ids text[], p_seed integer)
returns timestamptz
language plpgsql security definer set search_path = '' as $$
declare selected public.multiplayer_rooms%rowtype; start_time timestamptz;
begin
  if p_question_ids is null or cardinality(p_question_ids) <> 10
    or (select count(distinct item.question_id) from unnest(p_question_ids) as item(question_id)) <> 10
    or exists (select 1 from unnest(p_question_ids) as item(question_id) where item.question_id is null or char_length(item.question_id) not between 1 and 100)
    or p_seed is null or p_seed < 0 then
    raise exception 'Invalid game setup' using errcode = '22023';
  end if;
  select * into selected from public.multiplayer_rooms where id = p_room_id for update;
  if not found or selected.host_user_id is distinct from (select auth.uid()) then
    raise exception 'Only the host can start this room' using errcode = '42501';
  end if;
  if selected.status <> 'waiting' or selected.expires_at <= now()
    or (select count(*) from public.multiplayer_participants where room_id = p_room_id) < 2 then
    raise exception 'Room is not ready' using errcode = '22023';
  end if;
  start_time := now() + interval '3 seconds';
  update public.multiplayer_rooms
    set status = 'started', starts_at = start_time, question_ids = p_question_ids,
        question_seed = p_seed, question_index = 0, question_started_at = start_time
    where id = p_room_id;
  return start_time;
end;
$$;
revoke all on function public.start_multiplayer_game(uuid, text[], integer) from public, anon;
grant execute on function public.start_multiplayer_game(uuid, text[], integer) to authenticated;

create or replace function public.submit_multiplayer_answer(
  p_room_id uuid, p_question_index integer, p_is_correct boolean, p_points integer
) returns void
language plpgsql security definer set search_path = '' as $$
declare selected public.multiplayer_rooms%rowtype; player uuid := (select auth.uid());
begin
  if player is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_is_correct is null or p_points is null or p_points < 0 or p_points > 200 then
    raise exception 'Invalid answer result' using errcode = '22023';
  end if;
  select * into selected from public.multiplayer_rooms where id = p_room_id for update;
  if not found or not exists (
    select 1 from public.multiplayer_participants where room_id = p_room_id and user_id = player
  ) then
    raise exception 'Room unavailable' using errcode = '42501';
  end if;
  if selected.status <> 'started' or selected.question_index <> p_question_index
    or selected.question_started_at is null or now() < selected.question_started_at then
    raise exception 'Question unavailable' using errcode = '22023';
  end if;
  if now() >= selected.question_started_at + interval '20 seconds'
    and (p_is_correct or p_points <> 0) then
    raise exception 'Answer time expired' using errcode = '22023';
  end if;
  begin
    insert into public.multiplayer_round_answers(room_id, question_index, user_id, is_correct, points)
      values (p_room_id, p_question_index, player, p_is_correct, p_points);
  exception when unique_violation then
    raise exception 'Answer already submitted' using errcode = '23505';
  end;
end;
$$;
revoke all on function public.submit_multiplayer_answer(uuid, integer, boolean, integer) from public, anon;
grant execute on function public.submit_multiplayer_answer(uuid, integer, boolean, integer) to authenticated;

create or replace function public.get_multiplayer_answer_progress(p_room_id uuid)
returns table(answered integer, participants integer)
language plpgsql security definer set search_path = '' as $$
declare selected public.multiplayer_rooms%rowtype;
begin
  if not exists (select 1 from public.multiplayer_participants where room_id = p_room_id and user_id = (select auth.uid())) then
    raise exception 'Room unavailable' using errcode = '42501';
  end if;
  select * into selected from public.multiplayer_rooms where id = p_room_id;
  if not found or selected.status <> 'started' then return query select 0, 0; return; end if;
  return query
    select
      (select count(*)::integer from public.multiplayer_round_answers a where a.room_id = p_room_id and a.question_index = selected.question_index),
      (select count(*)::integer from public.multiplayer_participants p where p.room_id = p_room_id);
end;
$$;
revoke all on function public.get_multiplayer_answer_progress(uuid) from public, anon;
grant execute on function public.get_multiplayer_answer_progress(uuid) to authenticated;

create or replace function public.advance_multiplayer_question(p_room_id uuid, p_question_index integer)
returns table(room_status text, next_question_index integer, next_question_started_at timestamptz)
language plpgsql security definer set search_path = '' as $$
declare selected public.multiplayer_rooms%rowtype; answer_count integer; player_count integer; next_index integer; next_start timestamptz;
begin
  select * into selected from public.multiplayer_rooms where id = p_room_id for update;
  if not found or selected.host_user_id is distinct from (select auth.uid()) then
    raise exception 'Only the host can advance this room' using errcode = '42501';
  end if;
  if selected.status <> 'started' or selected.question_index <> p_question_index
    or selected.question_started_at is null then
    raise exception 'Question unavailable' using errcode = '22023';
  end if;
  select count(*)::integer into answer_count from public.multiplayer_round_answers
    where room_id = p_room_id and question_index = p_question_index;
  select count(*)::integer into player_count from public.multiplayer_participants where room_id = p_room_id;
  if answer_count < player_count and now() < selected.question_started_at + interval '20 seconds' then
    raise exception 'Answers pending' using errcode = '22023';
  end if;
  if p_question_index = cardinality(selected.question_ids) - 1 then
    update public.multiplayer_rooms set status = 'closed' where id = p_room_id;
    return query select 'closed'::text, p_question_index, selected.question_started_at;
    return;
  end if;
  next_index := p_question_index + 1;
  next_start := now() + interval '3 seconds';
  update public.multiplayer_rooms
    set question_index = next_index, question_started_at = next_start
    where id = p_room_id;
  return query select 'started'::text, next_index, next_start;
end;
$$;
revoke all on function public.advance_multiplayer_question(uuid, integer) from public, anon;
grant execute on function public.advance_multiplayer_question(uuid, integer) to authenticated;

create or replace function public.get_multiplayer_results(p_room_id uuid)
returns table(nickname text, total_points bigint, correct_answers bigint)
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.multiplayer_participants where room_id = p_room_id and user_id = (select auth.uid()))
    or not exists (select 1 from public.multiplayer_rooms where id = p_room_id and status = 'closed') then
    raise exception 'Results unavailable' using errcode = '42501';
  end if;
  return query
    select p.nickname, coalesce(sum(a.points), 0)::bigint, coalesce(sum(a.is_correct::integer), 0)::bigint
    from public.multiplayer_participants p
    left join public.multiplayer_round_answers a on a.room_id = p.room_id and a.user_id = p.user_id
    where p.room_id = p_room_id
    group by p.user_id, p.nickname, p.joined_at
    order by coalesce(sum(a.points), 0) desc, p.joined_at asc;
end;
$$;
revoke all on function public.get_multiplayer_results(uuid) from public, anon;
grant execute on function public.get_multiplayer_results(uuid) to authenticated;

commit;
