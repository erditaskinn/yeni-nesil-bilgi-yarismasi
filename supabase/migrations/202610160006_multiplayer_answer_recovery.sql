begin;

alter table public.multiplayer_round_answers
  add column if not exists selected_id text;

create or replace function public.submit_multiplayer_answer_v2(
  p_room_id uuid,
  p_question_index integer,
  p_is_correct boolean,
  p_points integer,
  p_selected_id text
) returns void
language plpgsql security definer set search_path = '' as $$
declare selected public.multiplayer_rooms%rowtype; player uuid := (select auth.uid());
begin
  if player is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_is_correct is null or p_points is null or p_points < 0 or p_points > 200
    or p_selected_id is not null and char_length(p_selected_id) > 200 then
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
    insert into public.multiplayer_round_answers(room_id, question_index, user_id, is_correct, points, selected_id)
      values (p_room_id, p_question_index, player, p_is_correct, p_points, p_selected_id);
  exception when unique_violation then
    raise exception 'Answer already submitted' using errcode = '23505';
  end;
end;
$$;
revoke all on function public.submit_multiplayer_answer_v2(uuid, integer, boolean, integer, text) from public, anon;
grant execute on function public.submit_multiplayer_answer_v2(uuid, integer, boolean, integer, text) to authenticated;

create or replace function public.get_my_multiplayer_answer(p_room_id uuid, p_question_index integer)
returns table(is_correct boolean, points integer, selected_id text)
language plpgsql security definer set search_path = '' as $$
declare player uuid := (select auth.uid());
begin
  if player is null or not exists (
    select 1 from public.multiplayer_participants where room_id = p_room_id and user_id = player
  ) then
    raise exception 'Room unavailable' using errcode = '42501';
  end if;
  return query
    select answer.is_correct, answer.points, answer.selected_id
    from public.multiplayer_round_answers as answer
    where answer.room_id = p_room_id
      and answer.question_index = p_question_index
      and answer.user_id = player;
end;
$$;
revoke all on function public.get_my_multiplayer_answer(uuid, integer) from public, anon;
grant execute on function public.get_my_multiplayer_answer(uuid, integer) to authenticated;

commit;
