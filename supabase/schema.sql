-- ==============================================================================
-- 🌿 ManausDev — Schema PostgreSQL para Supabase
-- ==============================================================================

-- Habilita extensões necessárias
create extension if not exists "uuid-ossp";

-- 1. Tabela de Perfis de Desenvolvedores / Usuários
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  email text,
  avatar_url text,
  role text default 'Developer',
  bio text,
  location text default 'Manaus-AM',
  skills text[] default '{}',
  github text,
  website text,
  linkedin text,
  available boolean default true,
  is_admin boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Tabela de Empresas
create table if not exists public.companies (
  id uuid default uuid_generate_v4() primary key,
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
  id uuid default uuid_generate_v4() primary key,
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
  id uuid default uuid_generate_v4() primary key,
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
  id uuid default uuid_generate_v4() primary key,
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
  id uuid default uuid_generate_v4() primary key,
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
  id uuid default uuid_generate_v4() primary key,
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

-- Perfis: Leitura pública, edição pelo próprio usuário
create policy "Perfis visíveis publicamente" on public.profiles
  for select using (true);

create policy "Usuários podem editar seu próprio perfil" on public.profiles
  for update using (auth.uid() = id);

create policy "Usuários podem inserir seu próprio perfil" on public.profiles
  for insert with check (auth.uid() = id);

-- Projetos: Leitura pública, criação/edição pelo autor
create policy "Projetos visíveis publicamente" on public.projects
  for select using (true);

create policy "Usuários autenticados podem criar projetos" on public.projects
  for insert with check (auth.role() = 'authenticated');

create policy "Autores podem editar seus próprios projetos" on public.projects
  for update using (auth.uid() = author_id);

create policy "Autores podem remover seus próprios projetos" on public.projects
  for delete using (auth.uid() = author_id);

-- Empresas: Leitura pública, criação por autenticados
create policy "Empresas visíveis publicamente" on public.companies
  for select using (true);

create policy "Usuários autenticados podem cadastrar empresas" on public.companies
  for insert with check (auth.role() = 'authenticated');

-- Comunidades: Leitura pública
create policy "Comunidades visíveis publicamente" on public.communities
  for select using (true);

-- Eventos: Leitura pública, criação por autenticados
create policy "Eventos visíveis publicamente" on public.events
  for select using (true);

create policy "Usuários autenticados podem criar eventos" on public.events
  for insert with check (auth.role() = 'authenticated');

-- Vagas: Leitura pública, criação por autenticados
create policy "Vagas visíveis publicamente" on public.jobs
  for select using (true);

create policy "Usuários autenticados podem publicar vagas" on public.jobs
  for insert with check (auth.role() = 'authenticated');

-- Contatos: Inserção pública, leitura apenas por admins
create policy "Qualquer pessoa pode enviar mensagem de contato" on public.contacts
  for insert with check (true);

create policy "Apenas administradores podem ler mensagens" on public.contacts
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

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

  insert into public.profiles (id, username, full_name, email, avatar_url)
  values (
    new.id,
    raw_username,
    raw_name,
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

