-- ==============================================================================
-- ManausDev — Tipos de perfil e matriz de permissões
--
-- 1. profile_type: discriminador do perfil ('dev' | 'empresa' | 'admin')
--    Nota: `role` continua sendo o cargo textual ('Frontend Engineer'); este
--    é o tipo de conta, não o cargo.
-- 2. is_admin é mantido por compatibilidade, mas deixa de ser a única fonte de
--    verdade: public.is_admin() aceita profile_type = 'admin' OU is_admin.
-- 3. Helpers security definer para as policies não recursarem em profiles.
-- 4. Guard trigger: sem ele, `update profiles set profile_type = 'admin'`
--    passaria na policy "edite o próprio perfil" e escalaria privilégio.
--
-- Matriz (fonte: src/lib/profile-types.ts)
--   dev     → projetos, eventos, notícias, canais de comunidade
--   empresa → própria empresa, vagas, eventos, notícias, canais de comunidade
--   admin   → CRUD em tudo
--
-- Pendente de tabela: `news` e `community_channels` ainda não existem no
-- schema; estão declarados na matriz e wiring de policy fica para quando
-- as tabelas forem criadas.
-- ==============================================================================

-- 1. Coluna + check constraint
alter table public.profiles add column if not exists profile_type text not null default 'dev';

do $$ begin
  alter table public.profiles add constraint profiles_profile_type_check
    check (profile_type in ('dev', 'empresa', 'admin'));
exception when duplicate_object then null; end $$;

-- 2. Backfill: quem já era admin vira admin; o resto nasce como dev
update public.profiles set profile_type = 'admin' where is_admin = true;
update public.profiles set profile_type = 'dev' where profile_type is null;

create index if not exists profiles_profile_type_idx on public.profiles (profile_type);

-- 3. Helpers de autorização
--    security definer evita recursão: as policies de profiles consultam
--    profile_type, e o SELECT público de profiles permitiria loop infinito.
create or replace function public.current_profile_type()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select profile_type from public.profiles where id = auth.uid()),
    'anon'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (profile_type = 'admin' or is_admin = true)
  );
$$;

create or replace function public.has_profile_type(allowed text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select profile_type = any(allowed) from public.profiles where id = auth.uid()),
    false
  );
$$;

-- 4. Anti-escalação: profile_type e is_admin só mudam por admin
create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.profile_type is distinct from old.profile_type and not public.is_admin() then
    raise exception 'profile_type só pode ser alterado por administradores'
      using errcode = '42501';
  end if;

  if new.is_admin is distinct from old.is_admin and not public.is_admin() then
    raise exception 'is_admin só pode ser alterado por administradores'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists on_profile_privileges_guard on public.profiles;
create trigger on_profile_privileges_guard
  before update on public.profiles
  for each row execute function public.guard_profile_privileges();

-- ==============================================================================
-- 🔒 RLS por profile_type
-- ==============================================================================

-- Perfis: leitura pública; edição apenas do próprio, sem tocar em privilégios
drop policy if exists "Usuários podem editar seu próprio perfil" on public.profiles;
create policy "Usuários podem editar seu próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- Projetos: escrita para dev e admin; empresa apenas lê
drop policy if exists "Usuários autenticados podem criar projetos" on public.projects;
create policy "Devs e admins podem criar projetos" on public.projects
  for insert with check (
    auth.uid() = author_id
    and public.has_profile_type(array['dev', 'admin'])
  );

drop policy if exists "Autores podem editar seus próprios projetos" on public.projects;
create policy "Autores e admins podem editar projetos" on public.projects
  for update using (auth.uid() = author_id or public.is_admin());

drop policy if exists "Autores podem remover seus próprios projetos" on public.projects;
create policy "Autores e admins podem remover projetos" on public.projects
  for delete using (auth.uid() = author_id or public.is_admin());

-- Eventos: escrita para dev, empresa e admin
drop policy if exists "Usuários autenticados podem criar eventos" on public.events;
create policy "Devs, empresas e admins podem criar eventos" on public.events
  for insert with check (
    auth.uid() = organizer_id
    and public.has_profile_type(array['dev', 'empresa', 'admin'])
  );

create policy "Organizadores e admins podem editar eventos" on public.events
  for update using (auth.uid() = organizer_id or public.is_admin());

create policy "Organizadores e admins podem remover eventos" on public.events
  for delete using (auth.uid() = organizer_id or public.is_admin());

-- Empresas: escrita para empresa (apenas o próprio registro) e admin
drop policy if exists "Usuários autenticados podem cadastrar empresas" on public.companies;
create policy "Empresas e admins podem cadastrar empresas" on public.companies
  for insert with check (
    auth.uid() = created_by
    and public.has_profile_type(array['empresa', 'admin'])
  );

create policy "Donos e admins podem editar empresas" on public.companies
  for update using (auth.uid() = created_by or public.is_admin());

create policy "Donos e admins podem remover empresas" on public.companies
  for delete using (auth.uid() = created_by or public.is_admin());

-- Vagas: escrita para empresa e admin
drop policy if exists "Usuários autenticados podem publicar vagas" on public.jobs;
create policy "Empresas e admins podem publicar vagas" on public.jobs
  for insert with check (
    auth.uid() = posted_by
    and public.has_profile_type(array['empresa', 'admin'])
  );

create policy "Publicadores e admins podem editar vagas" on public.jobs
  for update using (auth.uid() = posted_by or public.is_admin());

create policy "Publicadores e admins podem remover vagas" on public.jobs
  for delete using (auth.uid() = posted_by or public.is_admin());

-- Contatos: leitura e triagem restritas a admin
drop policy if exists "Apenas administradores podem ler mensagens" on public.contacts;
create policy "Apenas administradores podem ler mensagens" on public.contacts
  for select using (public.is_admin());

create policy "Apenas administradores podem tratar mensagens" on public.contacts
  for update using (public.is_admin());

-- Comunidades: leitura pública (sem escrita; canais ainda não existem)
-- A escrita em comunidades passa a existir junto com community_channels.
