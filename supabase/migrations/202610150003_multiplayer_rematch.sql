begin;

create or replace function public.rematch_multiplayer_game(p_room_id uuid, p_question_ids text[], p_seed integer)
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
    raise exception 'Only the host can rematch this room' using errcode = '42501';
  end if;
  if selected.status <> 'closed' or selected.expires_at <= now()
    or (select count(*) from public.multiplayer_participants where room_id = p_room_id) < 2 then
    raise exception 'Room is not ready for a rematch' using errcode = '22023';
  end if;

  delete from public.multiplayer_round_answers where room_id = p_room_id;
  start_time := now() + interval '3 seconds';
  update public.multiplayer_rooms
    set status = 'started', starts_at = start_time, question_ids = p_question_ids,
        question_seed = p_seed, question_index = 0, question_started_at = start_time
    where id = p_room_id;
  return start_time;
end;
$$;
revoke all on function public.rematch_multiplayer_game(uuid, text[], integer) from public, anon;
grant execute on function public.rematch_multiplayer_game(uuid, text[], integer) to authenticated;

commit;
