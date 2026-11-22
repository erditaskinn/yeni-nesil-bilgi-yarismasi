begin;

-- A completed round is the source of truth; profile percentages are derived on the client.
create table public.knowledge_profile_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  cleared_at timestamptz not null default '-infinity'::timestamptz
);
alter table public.knowledge_profile_settings enable row level security;
revoke all on public.knowledge_profile_settings from anon, authenticated;
grant select on public.knowledge_profile_settings to authenticated;
create policy own_knowledge_profile_settings_read on public.knowledge_profile_settings for select to authenticated using ((select auth.uid()) = user_id);

create table public.knowledge_rounds (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_at timestamptz not null,
  answers jsonb not null check (jsonb_typeof(answers) = 'array' and jsonb_array_length(answers) between 1 and 10000),
  created_at timestamptz not null default now()
);
create index knowledge_rounds_user_date_idx on public.knowledge_rounds(user_id, completed_at desc);
alter table public.knowledge_rounds enable row level security;
revoke all on public.knowledge_rounds from anon, authenticated;
grant select, insert, delete on public.knowledge_rounds to authenticated;
create policy own_knowledge_rounds_read on public.knowledge_rounds for select to authenticated using ((select auth.uid()) = user_id);
create policy own_knowledge_rounds_insert on public.knowledge_rounds for insert to authenticated with check (
  (select auth.uid()) = user_id and completed_at > coalesce((select cleared_at from public.knowledge_profile_settings where user_id = knowledge_rounds.user_id), '-infinity'::timestamptz)
);
create policy own_knowledge_rounds_delete on public.knowledge_rounds for delete to authenticated using ((select auth.uid()) = user_id);

create function public.clear_knowledge_profile() returns void language plpgsql security definer set search_path = '' as $$
declare owner uuid := (select auth.uid());
begin
  if owner is null then raise exception 'Not authenticated'; end if;
  insert into public.knowledge_profile_settings(user_id, cleared_at) values (owner, now())
    on conflict (user_id) do update set cleared_at = excluded.cleared_at;
  delete from public.knowledge_rounds where user_id = owner;
end;
$$;
revoke all on function public.clear_knowledge_profile() from public, anon;
grant execute on function public.clear_knowledge_profile() to authenticated;

commit;
