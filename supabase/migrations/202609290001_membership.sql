begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 30 and nickname = btrim(nickname) and nickname !~ '[[:cntrl:]<>]'),
  created_at timestamptz not null default now()
);
create table public.personal_bests (
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('mixed','space','science','history','culture')),
  difficulty text not null check (difficulty in ('easy','medium','hard','expert')),
  score integer not null check (score between 0 and 2000),
  updated_at timestamptz not null default now(),
  primary key (user_id, category, difficulty)
);
alter table public.profiles enable row level security;
alter table public.personal_bests enable row level security;

revoke all on public.profiles, public.personal_bests from anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select on public.personal_bests to authenticated;
create policy own_profile_read on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy own_profile_insert on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy own_profile_update on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy own_best_read on public.personal_bests for select to authenticated using ((select auth.uid()) = user_id);

create function public.create_member_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
declare candidate text := btrim(coalesce(new.raw_user_meta_data->>'nickname', 'Oyuncu'));
begin
  if char_length(candidate) not between 2 and 30 or candidate ~ '[[:cntrl:]<>]' then candidate := 'Oyuncu'; end if;
  insert into public.profiles(id, nickname) values (new.id, candidate);
  return new;
end;
$$;
revoke all on function public.create_member_profile() from public, anon, authenticated;
create trigger create_member_profile after insert on auth.users for each row execute function public.create_member_profile();

-- No caller-supplied user ID can target another account; maxima are atomic.
-- Personal bests are client-reported, not competitive/anti-cheat results.
create function public.save_personal_best(p_owner uuid, p_category text, p_difficulty text, p_score integer)
returns table(category text, difficulty text, score integer)
language plpgsql security definer set search_path = '' as $$
declare owner uuid := auth.uid();
begin
  if owner is null or p_owner is distinct from owner or not exists (select 1 from auth.users where id = owner and email_confirmed_at is not null) then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_category is null or p_category not in ('mixed','space','science','history','culture') or p_difficulty is null or p_difficulty not in ('easy','medium','hard','expert') or p_score is null or p_score not between 0 and 2000 then
    raise exception 'Invalid personal best' using errcode = '22023';
  end if;
  insert into public.personal_bests as existing(user_id, category, difficulty, score)
    values(owner, p_category, p_difficulty, p_score)
    on conflict on constraint personal_bests_pkey do update
      set score = greatest(existing.score, excluded.score), updated_at = now();
  return query select b.category, b.difficulty, b.score from public.personal_bests b
    where b.user_id = owner and b.category = p_category and b.difficulty = p_difficulty;
end;
$$;
revoke all on function public.save_personal_best(uuid, text, text, integer) from public, anon;
grant execute on function public.save_personal_best(uuid, text, text, integer) to authenticated;

commit;
