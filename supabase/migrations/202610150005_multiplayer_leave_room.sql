begin;

create or replace function public.leave_multiplayer_room(p_room_id uuid)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  selected public.multiplayer_rooms%rowtype;
  player uuid := (select auth.uid());
  successor uuid;
begin
  if player is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select * into selected from public.multiplayer_rooms where id = p_room_id for update;
  if not found or not exists (
    select 1 from public.multiplayer_participants
    where room_id = p_room_id and user_id = player
  ) then
    raise exception 'Room unavailable' using errcode = '42501';
  end if;

  select user_id into successor
    from public.multiplayer_participants
    where room_id = p_room_id and user_id <> player
    order by joined_at, user_id
    limit 1;

  if selected.host_user_id = player and successor is not null then
    update public.multiplayer_rooms set host_user_id = successor where id = p_room_id;
  end if;

  delete from public.multiplayer_round_answers
    where room_id = p_room_id and user_id = player;
  delete from public.multiplayer_participants
    where room_id = p_room_id and user_id = player;

  if successor is null then
    delete from public.multiplayer_rooms where id = p_room_id;
  end if;
end;
$$;
revoke all on function public.leave_multiplayer_room(uuid) from public, anon;
grant execute on function public.leave_multiplayer_room(uuid) to authenticated;

commit;
