-- ==============================================================================
-- Normalização de skills: de text[] para tabelas skills + person_skills + job_skills
-- ADR 0021, Fase 3
-- ==============================================================================

-- Tabela canônica de skills (vocabulário)
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  category text,
  created_at timestamptz default now() not null
);

create index if not exists skills_slug_idx on public.skills (slug);
create index if not exists skills_name_idx on public.skills (name);

-- Relação pessoa ↔ skill
create table if not exists public.person_skills (
  person_id uuid references public.profiles(id) on delete cascade not null,
  skill_id uuid references public.skills(id) on delete cascade not null,
  level text,
  years integer,
  created_at timestamptz default now() not null,
  primary key (person_id, skill_id)
);

create index if not exists person_skills_person_idx on public.person_skills (person_id);
create index if not exists person_skills_skill_idx on public.person_skills (skill_id);

-- Relação vaga ↔ skill
create table if not exists public.job_skills (
  job_id uuid references public.jobs(id) on delete cascade not null,
  skill_id uuid references public.skills(id) on delete cascade not null,
  primary key (job_id, skill_id)
);

create index if not exists job_skills_job_idx on public.job_skills (job_id);
create index if not exists job_skills_skill_idx on public.job_skills (skill_id);

-- RLS
alter table public.skills enable row level security;
alter table public.person_skills enable row level security;
alter table public.job_skills enable row level security;

-- Skills é leitura pública, escrita apenas por admin
create policy "Skills visíveis publicamente" on public.skills
  for select using (true);

create policy "Admins podem gerenciar skills" on public.skills
  for all using (public.is_admin()) with check (public.is_admin());

-- person_skills: leitura pública, escrita pelo próprio usuário ou admin
create policy "Person skills visíveis publicamente" on public.person_skills
  for select using (true);

create policy "Usuários podem gerenciar suas próprias skills" on public.person_skills
  for all using (auth.uid() = person_id or public.is_admin())
  with check (auth.uid() = person_id or public.is_admin());

-- job_skills: leitura pública, escrita por quem publicou a vaga ou admin
create policy "Job skills visíveis publicamente" on public.job_skills
  for select using (true);

create policy "Publicadores e admins podem gerenciar job skills" on public.job_skills
  for all using (
    exists (
      select 1 from public.jobs j
      where j.id = job_skills.job_id and (j.posted_by = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.jobs j
      where j.id = job_skills.job_id and (j.posted_by = auth.uid() or public.is_admin())
    )
  );

-- Função helper para slugify
create or replace function public.slugify(text)
returns text
language sql immutable
as $$
  select lower(regexp_replace(coalesce($1, ''), '[^a-z0-9]+', '-', 'gi'));
$$;

-- Seed skills a partir de profiles.skills e jobs.skills
with all_profile_skills as (
  select unnest(skills) as skill_name
  from public.profiles
  where skills is not null
),
all_job_skills as (
  select unnest(skills) as skill_name
  from public.jobs
  where skills is not null
),
all_skills as (
  select distinct lower(trim(skill_name)) as name
  from (
    select skill_name from all_profile_skills
    union all
    select skill_name from all_job_skills
  ) s
  where skill_name <> ''
)
insert into public.skills (slug, name)
select
  public.slugify(name) as slug,
  initcap(name) as name
from all_skills
on conflict (slug) do nothing;

-- Popular person_skills a partir de profiles.skills
insert into public.person_skills (person_id, skill_id)
select distinct p.id, s.id
from public.profiles p
join public.skills s on s.slug = public.slugify(lower(trim(unnest(p.skills))))
where p.skills is not null
on conflict do nothing;

-- Popular job_skills a partir de jobs.skills
insert into public.job_skills (job_id, skill_id)
select distinct j.id, s.id
from public.jobs j
join public.skills s on s.slug = public.slugify(lower(trim(unnest(j.skills))))
where j.skills is not null
on conflict do nothing;

-- Views para compatibilidade (opcional, para queries legadas)
create or replace view public.profiles_with_skills as
select
  p.*,
  coalesce(
    array_agg(s.name) filter (where s.name is not null),
    '{}'::text[]
  ) as skills_normalized
from public.profiles p
left join public.person_skills ps on ps.person_id = p.id
left join public.skills s on s.id = ps.skill_id
group by p.id;

create or replace view public.jobs_with_skills as
select
  j.*,
  coalesce(
    array_agg(s.name) filter (where s.name is not null),
    '{}'::text[]
  ) as skills_normalized
from public.jobs j
left join public.job_skills js on js.job_id = j.id
left join public.skills s on s.id = js.skill_id
group by j.id;
