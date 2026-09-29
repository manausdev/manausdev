-- ==============================================================================
-- ManausDev — Upgrade do diretório de devs (análise de gaps vs concorrentes)
--
-- 1. availability: 3 estados (open / offers / busy) substitui o boolean `available`
-- 2. seniority: junior / pleno / senior / lead
-- 3. city: cidade normalizada para filtro (location segue como texto livre)
-- 4. LGPD: remove `email` de profiles — o e-mail vive em auth.users e não deve
--    ser exposto pela policy pública de SELECT
-- 5. Índices para os filtros do diretório (cidade × stack × disponibilidade)
-- ==============================================================================

-- 1–3. Novas colunas
alter table public.profiles add column if not exists availability text not null default 'open';
alter table public.profiles add column if not exists seniority text;
alter table public.profiles add column if not exists city text not null default 'Manaus';

-- Migra o estado do boolean antigo antes de removê-lo
update public.profiles set availability = 'busy' where available = false;

-- Check constraints (idempotentes)
do $$ begin
  alter table public.profiles add constraint profiles_availability_check
    check (availability in ('open', 'offers', 'busy'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.profiles add constraint profiles_seniority_check
    check (seniority is null or seniority in ('junior', 'pleno', 'senior', 'lead'));
exception when duplicate_object then null; end $$;

-- 4. LGPD: e-mail deixa de ser coluna pública; disponibilidade booleana sai do schema
alter table public.profiles drop column if exists available;
alter table public.profiles drop column if exists email;

-- 5. Índices para o diretório
create index if not exists profiles_city_idx on public.profiles (city);
create index if not exists profiles_availability_idx on public.profiles (availability);
create index if not exists profiles_seniority_idx on public.profiles (seniority);
create index if not exists profiles_skills_idx on public.profiles using gin (skills);

-- Trigger de novo usuário sem gravar e-mail em profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  raw_username text;
  raw_name text;
begin
  raw_username := coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1));
  raw_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', raw_username);

  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    raw_username,
    raw_name,
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
