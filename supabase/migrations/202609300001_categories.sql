begin;

-- Additive only: existing mixed/space/science/history/culture rows keep their keys.
-- history_v2 is the new History category; history remains the earlier combined record.
alter table public.personal_bests drop constraint if exists personal_bests_category_check;
alter table public.personal_bests add constraint personal_bests_category_check check (
  category in (
    'mixed', 'space', 'science', 'history', 'culture',
    'science_nature', 'history_v2', 'geography', 'arts_culture', 'sports',
    'technology', 'cinema_television', 'language_literature', 'turkiye', 'general_knowledge'
  )
);

create or replace function public.save_personal_best(p_owner uuid, p_category text, p_difficulty text, p_score integer)
returns table(category text, difficulty text, score integer)
language plpgsql security definer set search_path = '' as $$
declare owner uuid := auth.uid();
begin
  if owner is null or p_owner is distinct from owner or not exists (select 1 from auth.users where id = owner and email_confirmed_at is not null) then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_category is null or p_category not in (
    'mixed', 'space', 'science', 'history', 'culture',
    'science_nature', 'history_v2', 'geography', 'arts_culture', 'sports',
    'technology', 'cinema_television', 'language_literature', 'turkiye', 'general_knowledge'
  ) or p_difficulty is null or p_difficulty not in ('easy','medium','hard','expert') or p_score is null or p_score not between 0 and 2000 then
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

commit;
