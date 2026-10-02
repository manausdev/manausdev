-- Fix username collision on signup / OAuth
-- Generates a unique username by appending numeric suffix if needed
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  candidate_username text;
  suffix int := 0;
  raw_name text;
begin
  base_username := coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1));
  -- sanitize basic: lower case and replace spaces
  base_username := lower(regexp_replace(base_username, '[^a-z0-9_]', '_', 'g'));
  if base_username = '' then
    base_username := 'user';
  end if;

  raw_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', base_username);

  candidate_username := base_username;
  -- ensure uniqueness
  while exists (select 1 from public.profiles where username = candidate_username) loop
    suffix := suffix + 1;
    candidate_username := base_username || '_' || suffix;
  end loop;

  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    candidate_username,
    raw_name,
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
