-- ==============================================================================
-- ManausDev — Notícias, canais de comunidade e curadoria de profile_type
--
-- 1. `news`: conteúdo editorial. dev, empresa e admin publicam (matriz do ADR 0016).
-- 2. `community_channels`: canais dentro de uma comunidade. `communities.links`
--    continua sendo para links externos soltos (discord, telegram); aqui o canal
--    é uma entidade com dono, para que a escrita possa ser atribuída.
-- 3. `profiles`: policy de UPDATE para admin. Antes disso o guard trigger de
--    profile_type proibia a mudança, mas a policy `using (auth.uid() = id)`
--    impedia o admin de editar qualquer perfil que não fosse o próprio — a
--    curadoria era impossível de exercer.
-- ==============================================================================

-- 1. Notícias
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

-- 2. Canais de comunidade
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

-- ==============================================================================
-- 🔒 RLS
-- ==============================================================================

alter table public.news enable row level security;
alter table public.community_channels enable row level security;

-- 3. Curadoria de perfil: admin edita qualquer perfil
--    O guard_profile_privileges (20260929140000) continua sendo quem decide se
--    profile_type/is_admin podem mudar; esta policy só abre o alcance.
--    WITH CHECK em is_admin() usa o snapshot do início do statement, então o
--    admin continua podendo rebaixar a si mesmo — a UI simplesmente não oferece.
create policy "Admins podem editar qualquer perfil" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- Notícias: leitura pública do que está publicado, escrita por dev/empresa/admin
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

-- Canais: leitura pública, escrita por dev/empresa/admin
-- Não há coluna de donatário além de created_by, então a escrita é por tipo.
create policy "Canais visíveis publicamente" on public.community_channels
  for select using (true);

create policy "Devs, empresas e admins podem criar canais" on public.community_channels
  for insert with check (public.has_profile_type(array['dev', 'empresa', 'admin']));

create policy "Criadores e admins podem editar canais" on public.community_channels
  for update using (auth.uid() = created_by or public.is_admin());

create policy "Criadores e admins podem remover canais" on public.community_channels
  for delete using (auth.uid() = created_by or public.is_admin());
