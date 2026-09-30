-- ==============================================================================
-- 🌿 ManausDev — Schema PostgreSQL para Supabase
-- ==============================================================================

-- Habilita extensões necessárias
-- gen_random_uuid() é nativo no Postgres 13+ (sem extensão necessária)

-- 1. Tabela de Perfis de Desenvolvedores / Usuários
-- Nota LGPD: o e-mail NÃO é coluna de profiles — vive apenas em auth.users.
-- `role` é o cargo textual ('Frontend Engineer'); `profile_type` é o tipo de
-- conta ('dev' | 'empresa' | 'admin') e dirige as permissões.
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  role text default 'Developer',
  profile_type text not null default 'dev',
  bio text,
  location text default 'Manaus-AM',
  city text not null default 'Manaus',
  seniority text, -- junior, pleno, senior, lead
  availability text not null default 'open', -- open, offers, busy
  skills text[] default '{}',
  github text,
  website text,
  linkedin text,
  is_admin boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint profiles_availability_check check (availability in ('open', 'offers', 'busy')),
  constraint profiles_seniority_check check (seniority is null or seniority in ('junior', 'pleno', 'senior', 'lead')),
  constraint profiles_profile_type_check check (profile_type in ('dev', 'empresa', 'admin'))
);

-- 2. Tabela de Empresas
create table if not exists public.companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  industry text,
  location text default 'Manaus-AM',
  size text,
  website text,
  logo_url text,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null
);

-- 3. Tabela de Projetos
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  stack text[] default '{}',
  links jsonb default '{}'::jsonb, -- { github, demo, website }
  image_url text,
  featured boolean default false,
  author_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. Tabela de Comunidades
create table if not exists public.communities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  members_count integer default 0,
  type text default 'tech',
  links jsonb default '{}'::jsonb,
  logo_url text,
  created_at timestamptz default now() not null
);

-- 5. Tabela de Eventos
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamptz not null,
  location text not null,
  type text default 'meetup', -- meetup, hackathon, workshop, conference
  link text,
  organizer_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null
);

-- 6. Tabela de Vagas de Emprego
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  type text default 'CLT', -- CLT, PJ, Estágio
  remote boolean default false,
  salary text,
  link text,
  location text default 'Manaus-AM',
  skills text[] default '{}',
  posted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null
);

-- 7. Tabela de Mensagens de Contato
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'unread',
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- 🔒 Row Level Security (RLS)
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.projects enable row level security;
alter table public.communities enable row level security;
alter table public.events enable row level security;
alter table public.jobs enable row level security;
alter table public.contacts enable row level security;

-- ------------------------------------------------------------------------------
-- Helpers de autorização (security definer evita recursão em profiles)
-- ------------------------------------------------------------------------------
create or replace function public.current_profile_type()
returns text
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select profile_type from public.profiles where id = auth.uid()),
    'anon'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and (profile_type = 'admin' or is_admin = true)
  );
$$;

create or replace function public.has_profile_type(allowed text[])
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select profile_type = any(allowed) from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Anti-escalação: sem este trigger, `update profiles set profile_type = 'admin'`
-- passaria na policy de edição do próprio perfil e viraria admin.
create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.profile_type is distinct from old.profile_type and not public.is_admin() then
    raise exception 'profile_type só pode ser alterado por administradores' using errcode = '42501';
  end if;
  if new.is_admin is distinct from old.is_admin and not public.is_admin() then
    raise exception 'is_admin só pode ser alterado por administradores' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger on_profile_privileges_guard
  before update on public.profiles
  for each row execute function public.guard_profile_privileges();

-- Matriz de permissões (fonte: src/lib/profile-types.ts)
--   dev     → projetos, eventos, notícias, canais de comunidade
--   empresa → própria empresa, vagas, eventos, notícias, canais de comunidade
--   admin   → CRUD em tudo
-- `news` e `community_channels` são criadas em 20260929150000, mais abaixo.

-- Perfis: leitura pública, edição pelo próprio usuário
create policy "Perfis visíveis publicamente" on public.profiles
  for select using (true);

create policy "Usuários podem editar seu próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- Curadoria: o admin edita qualquer perfil. O trigger guard_profile_privileges
-- continua decidindo se profile_type/is_admin podem mudar; esta policy só abre
-- o alcance, senão o admin não conseguiria editar ninguém além de si mesmo.
create policy "Admins podem editar qualquer perfil" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

create policy "Usuários podem inserir seu próprio perfil" on public.profiles
  for insert with check (auth.uid() = id);

-- Projetos: escrita para dev e admin
create policy "Projetos visíveis publicamente" on public.projects
  for select using (true);

create policy "Devs e admins podem criar projetos" on public.projects
  for insert with check (
    auth.uid() = author_id
    and public.has_profile_type(array['dev', 'admin'])
  );

create policy "Autores e admins podem editar projetos" on public.projects
  for update using (auth.uid() = author_id or public.is_admin());

create policy "Autores e admins podem remover projetos" on public.projects
  for delete using (auth.uid() = author_id or public.is_admin());

-- Empresas: leitura pública, escrita da própria empresa e admin
create policy "Empresas visíveis publicamente" on public.companies
  for select using (true);

create policy "Empresas e admins podem cadastrar empresas" on public.companies
  for insert with check (
    auth.uid() = created_by
    and public.has_profile_type(array['empresa', 'admin'])
  );

create policy "Donos e admins podem editar empresas" on public.companies
  for update using (auth.uid() = created_by or public.is_admin());

create policy "Donos e admins podem remover empresas" on public.companies
  for delete using (auth.uid() = created_by or public.is_admin());

-- Comunidades: leitura pública (escrita entra com community_channels)
create policy "Comunidades visíveis publicamente" on public.communities
  for select using (true);

-- Eventos: escrita para dev, empresa e admin
create policy "Eventos visíveis publicamente" on public.events
  for select using (true);

create policy "Devs, empresas e admins podem criar eventos" on public.events
  for insert with check (
    auth.uid() = organizer_id
    and public.has_profile_type(array['dev', 'empresa', 'admin'])
  );

create policy "Organizadores e admins podem editar eventos" on public.events
  for update using (auth.uid() = organizer_id or public.is_admin());

create policy "Organizadores e admins podem remover eventos" on public.events
  for delete using (auth.uid() = organizer_id or public.is_admin());

-- Vagas: escrita para empresa e admin
create policy "Vagas visíveis publicamente" on public.jobs
  for select using (true);

create policy "Empresas e admins podem publicar vagas" on public.jobs
  for insert with check (
    auth.uid() = posted_by
    and public.has_profile_type(array['empresa', 'admin'])
  );

create policy "Publicadores e admins podem editar vagas" on public.jobs
  for update using (auth.uid() = posted_by or public.is_admin());

create policy "Publicadores e admins podem remover vagas" on public.jobs
  for delete using (auth.uid() = posted_by or public.is_admin());

-- Contatos: inserção pública, leitura e triagem apenas por admins
create policy "Qualquer pessoa pode enviar mensagem de contato" on public.contacts
  for insert with check (true);

create policy "Apenas administradores podem ler mensagens" on public.contacts
  for select using (public.is_admin());

create policy "Apenas administradores podem tratar mensagens" on public.contacts
  for update using (public.is_admin());

-- ==============================================================================
-- 📰 Notícias (20260929150000)
-- ==============================================================================

create table if not exists public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  content text,
  image_url text,
  category text default 'geral', -- geral, evento, vaga, lancamento, analise
  published boolean default false,
  published_at timestamptz,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint news_category_check check (category in ('geral', 'evento', 'vaga', 'lancamento', 'analise'))
);

create index if not exists news_published_idx on public.news (published, published_at desc);

alter table public.news enable row level security;

-- Rascunhos ficam privados: só o autor e admins enxergam o que não foi publicado.
create policy "Notícias publicadas são visíveis publicamente" on public.news
  for select using (published = true or auth.uid() = author_id or public.is_admin());

create policy "Devs, empresas e admins podem criar notícias" on public.news
  for insert with check (
    auth.uid() = author_id
    and public.has_profile_type(array['dev', 'empresa', 'admin'])
  );

create policy "Autores e admins podem editar notícias" on public.news
  for update using (auth.uid() = author_id or public.is_admin());

create policy "Autores e admins podem remover notícias" on public.news
  for delete using (auth.uid() = author_id or public.is_admin());

-- ==============================================================================
-- 💬 Canais de comunidade (20260929150000)
--
-- `communities.links` continua guardando links externos soltos; aqui o canal é
-- uma entidade com dono, para que a escrita possa ser atribuída.
-- ==============================================================================

create table if not exists public.community_channels (
  id uuid default gen_random_uuid() primary key,
  community_id uuid references public.communities(id) on delete cascade not null,
  name text not null,
  description text,
  platform text not null default 'discord', -- discord, telegram, whatsapp, matrix
  url text,
  members_count integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint community_channels_platform_check check (platform in ('discord', 'telegram', 'whatsapp', 'matrix')),
  constraint community_channels_url_check check (url is null or url ~ '^https?://')
);

create index if not exists community_channels_community_idx on public.community_channels (community_id);

alter table public.community_channels enable row level security;

create policy "Canais visíveis publicamente" on public.community_channels
  for select using (true);

-- `auth.uid() = created_by` veio em 20260929160000: sem ele qualquer dev criava
-- canais em nome de outra pessoa e perdia o controle do próprio registro.
create policy "Devs, empresas e admins podem criar canais" on public.community_channels
  for insert with check (
    auth.uid() = created_by
    and public.has_profile_type(array['dev', 'empresa', 'admin'])
  );

create policy "Criadores e admins podem editar canais" on public.community_channels
  for update using (auth.uid() = created_by or public.is_admin());

create policy "Criadores e admins podem remover canais" on public.community_channels
  for delete using (auth.uid() = created_by or public.is_admin());

-- ==============================================================================
-- ⚡ Trigger para criação automática de perfil ao registrar usuário
-- ==============================================================================

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

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 🗂️ Índices para o diretório de devs (filtros: cidade × stack × disponibilidade)
-- ==============================================================================

create index if not exists profiles_city_idx on public.profiles (city);
create index if not exists profiles_availability_idx on public.profiles (availability);
create index if not exists profiles_seniority_idx on public.profiles (seniority);
create index if not exists profiles_profile_type_idx on public.profiles (profile_type);
create index if not exists profiles_skills_idx on public.profiles using gin (skills);

