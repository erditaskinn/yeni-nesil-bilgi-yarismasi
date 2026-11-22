begin;

create table public.multiplayer_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-F0-9]{6}$'),
  host_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'waiting' check (status in ('waiting', 'started', 'closed')),
  starts_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '2 hours')
);
create table public.multiplayer_participants (
  room_id uuid not null references public.multiplayer_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 30 and nickname = btrim(nickname) and nickname !~ '[[:cntrl:]<>]'),
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);
create unique index multiplayer_participants_name_idx on public.multiplayer_participants(room_id, lower(nickname));
create index multiplayer_participants_user_idx on public.multiplayer_participants(user_id);

alter table public.multiplayer_rooms enable row level security;
alter table public.multiplayer_participants enable row level security;
revoke all on public.multiplayer_rooms, public.multiplayer_participants from anon, authenticated;
grant select on public.multiplayer_rooms, public.multiplayer_participants to authenticated;

create function public.is_multiplayer_member(p_room_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null and exists (
    select 1 from public.multiplayer_participants
    where room_id = p_room_id and user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_multiplayer_member(uuid) from public, anon;
grant execute on function public.is_multiplayer_member(uuid) to authenticated;
create policy multiplayer_room_member_read on public.multiplayer_rooms
  for select to authenticated using (public.is_multiplayer_member(id));
create policy multiplayer_participant_member_read on public.multiplayer_participants
  for select to authenticated using (public.is_multiplayer_member(room_id));

create function public.create_multiplayer_room(p_nickname text)
returns table(room_id uuid, room_code text)
language plpgsql security definer set search_path = '' as $$
declare owner uuid := (select auth.uid()); new_id uuid; new_code text; tries integer := 0;
begin
  if owner is null or coalesce((select (auth.jwt()->>'is_anonymous')::boolean), false)
    or not exists (select 1 from auth.users where id = owner and email_confirmed_at is not null) then
    raise exception 'A verified account is required to host' using errcode = '42501';
  end if;
  if p_nickname is null or char_length(p_nickname) not between 2 and 30 or p_nickname <> btrim(p_nickname) or p_nickname ~ '[[:cntrl:]<>]' then
    raise exception 'Invalid nickname' using errcode = '22023';
  end if;
  if (select count(*) from public.multiplayer_rooms where host_user_id = owner and status = 'waiting' and expires_at > now()) >= 3 then
    raise exception 'Too many open rooms' using errcode = '22023';
  end if;
  loop
    tries := tries + 1;
    new_code := upper(substr(md5(gen_random_uuid()::text), 1, 6));
    begin
      insert into public.multiplayer_rooms(code, host_user_id) values (new_code, owner) returning id into new_id;
      exit;
    exception when unique_violation then
      if tries >= 5 then raise; end if;
    end;
  end loop;
  insert into public.multiplayer_participants(room_id, user_id, nickname) values (new_id, owner, p_nickname);
  return query select new_id, new_code;
end;
$$;
revoke all on function public.create_multiplayer_room(text) from public, anon;
grant execute on function public.create_multiplayer_room(text) to authenticated;

create function public.join_multiplayer_room(p_code text, p_nickname text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare player uuid := (select auth.uid()); selected public.multiplayer_rooms%rowtype;
begin
  if player is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_code is null or upper(btrim(p_code)) !~ '^[A-F0-9]{6}$'
    or p_nickname is null or char_length(p_nickname) not between 2 and 30
    or p_nickname <> btrim(p_nickname) or p_nickname ~ '[[:cntrl:]<>]' then
    raise exception 'Invalid room code or nickname' using errcode = '22023';
  end if;
  select * into selected from public.multiplayer_rooms
    where code = upper(btrim(p_code)) and expires_at > now() for update;
  if not found or selected.status <> 'waiting' then
    raise exception 'Room unavailable' using errcode = '22023';
  end if;
  if not exists (select 1 from public.multiplayer_participants where room_id = selected.id and user_id = player)
    and (select count(*) from public.multiplayer_participants where room_id = selected.id) >= 8 then
    raise exception 'Room is full' using errcode = '22023';
  end if;
  insert into public.multiplayer_participants(room_id, user_id, nickname)
    values (selected.id, player, p_nickname)
    on conflict (room_id, user_id) do update set nickname = excluded.nickname;
  return selected.id;
end;
$$;
revoke all on function public.join_multiplayer_room(text, text) from public, anon;
grant execute on function public.join_multiplayer_room(text, text) to authenticated;

create function public.start_multiplayer_room(p_room_id uuid)
returns timestamptz language plpgsql security definer set search_path = '' as $$
declare selected public.multiplayer_rooms%rowtype; start_time timestamptz;
begin
  select * into selected from public.multiplayer_rooms where id = p_room_id for update;
  if not found or selected.host_user_id is distinct from (select auth.uid()) then
    raise exception 'Only the host can start this room' using errcode = '42501';
  end if;
  if selected.status <> 'waiting' or selected.expires_at <= now()
    or (select count(*) from public.multiplayer_participants where room_id = p_room_id) < 2 then
    raise exception 'Room is not ready' using errcode = '22023';
  end if;
  start_time := now() + interval '3 seconds';
  update public.multiplayer_rooms set status = 'started', starts_at = start_time where id = p_room_id;
  return start_time;
end;
$$;
revoke all on function public.start_multiplayer_room(uuid) from public, anon;
grant execute on function public.start_multiplayer_room(uuid) to authenticated;

alter publication supabase_realtime add table public.multiplayer_rooms, public.multiplayer_participants;

commit;
