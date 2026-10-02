-- 20261002000000_contributions_moderation.sql
-- Domínios contributions e moderation (ADR 0026, Fase 5)

-- Badges com critérios públicos
create table if not exists public.badges (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  criteria_json jsonb not null default '{}'::jsonb,
  icon text,
  created_at timestamptz default now() not null
);

-- Concessão de badges a usuários
create table if not exists public.user_badges (
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id uuid references public.badges(id) on delete cascade not null,
  awarded_at timestamptz default now() not null,
  evidence_json jsonb default '{}'::jsonb,
  primary key (user_id, badge_id)
);

-- Eventos de reputação lastreados em contribuições reais
create table if not exists public.reputation_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- project_created, event_attended, community_created, etc
  source_table text not null,
  source_id uuid not null,
  points integer not null default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index if not exists reputation_events_user_idx on public.reputation_events(user_id);
create index if not exists reputation_events_type_idx on public.reputation_events(type);

-- Denúncias / moderação
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null, -- profile, project, event, community, job
  target_id uuid not null,
  reason text not null,
  status text not null default 'open', -- open, reviewed, resolved, dismissed
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz default now() not null,
  constraint reports_status_check check (status in ('open','reviewed','resolved','dismissed'))
);

-- Verificações de perfil/empresa
create table if not exists public.verifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- profile, company
  status text not null default 'pending', -- pending, approved, rejected
  evidence_url text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz default now() not null,
  constraint verifications_status_check check (status in ('pending','approved','rejected'))
);

-- RLS
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.reputation_events enable row level security;
alter table public.reports enable row level security;
alter table public.verifications enable row level security;

-- Badges públicas
create policy "Badges visíveis publicamente" on public.badges for select using (true);
create policy "User badges visíveis publicamente" on public.user_badges for select using (true);

-- Reputation events: leitura pública, escrita via service role / trigger
create policy "Reputation events visíveis publicamente" on public.reputation_events for select using (true);

-- Reports: inserção pública, leitura/edição admin
create policy "Qualquer pessoa pode denunciar" on public.reports for insert with check (true);
create policy "Admins podem ler reports" on public.reports for select using (public.is_admin());
create policy "Admins podem atualizar reports" on public.reports for update using (public.is_admin());

-- Verifications: usuário vê as próprias, admin vê tudo
create policy "Usuário vê suas verificações" on public.verifications for select using (auth.uid() = user_id or public.is_admin());
create policy "Usuário cria verificação" on public.verifications for insert with check (auth.uid() = user_id);
create policy "Admins atualizam verificações" on public.verifications for update using (public.is_admin());
