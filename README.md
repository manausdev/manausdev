# 🌊 ManausDev

> **A infraestrutura aberta da comunidade de tecnologia do Amazonas.**
>
> *Quem constrói tecnologia em Manaus está aqui.*

[![CI](https://github.com/manausdev/manausdev/actions/workflows/ci.yml/badge.svg)](https://github.com/manausdev/manausdev/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

Plataforma fullstack que conecta **pessoas, projetos, empresas, vagas, eventos e comunidades** de tecnologia de Manaus. Não é um "LinkedIn regional": é o Community OS da região — identidade profissional, discovery local e o grafo da comunidade tech do Amazonas em um só lugar ([ADR 0021](docs/adr/0021-community-os-domain-architecture-and-roadmap.md)).

**[Explorar Devs](https://manausdev.vercel.app/devs)** · **[Projetos](https://manausdev.vercel.app/projetos)** · **[Empresas](https://manausdev.vercel.app/empresas)** · **[Vagas](https://manausdev.vercel.app/vagas)** · **[Eventos](https://manausdev.vercel.app/eventos)** · **[Comunidades](https://manausdev.vercel.app/comunidades)**

**Made in Manaus • Open Source**

---

## ✨ O que existe hoje

- **Diretório de devs** com estado dos filtros na URL — busca, skills multi-select com contagens, cidade, disponibilidade (3 estados: aberto / propostas / ocupado), senioridade e ordenação
- **Perfis públicos** em `/devs/[username]` com skills, disponibilidade e links
- **Vitrines com página de detalhe**: projetos, empresas, vagas, eventos, comunidades e notícias — comunidades incluem os **canais** da comunidade (WhatsApp, Telegram, Discord)
- **Dashboard** do membro — edição de perfil e projetos
- **Autenticação** Supabase (email/senha + OAuth GitHub) com sessão SSR via cookies
- **PostgreSQL com RLS** e matriz de permissões por tipo de perfil (`dev` / `empresa` / `admin`) — [ADR 0016](docs/adr/0016-profile-types-and-permission-matrix.md)
- **Design system atômico** (atoms → molecules → organisms → templates) em CSS Modules, sem bibliotecas de UI
- **Modo claro/escuro** com tokens semânticos Blue-Tech
- **Testes** com Vitest + Testing Library e **CI** com build, testes e auditoria de links

---

## ⚡ Stack Tecnológica

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, React 19, Server & Client Components)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** **CSS Modules + design tokens** (custom properties) — zero bibliotecas de UI; Tailwind totalmente removido ([ADR 0017](docs/adr/0017-css-modules-migration-icons-and-audit-findings.md))
- **BaaS & Backend:** [Supabase](https://supabase.com/) (`@supabase/ssr`) — PostgreSQL com Row Level Security (RLS), triggers e migrations versionadas
- **Autenticação:** Supabase Auth (Email/Senha + OAuth GitHub) com sessão SSR via cookies
- **Testes & Design system:** Vitest + Testing Library · Storybook
- **CI/CD:** GitHub Actions (build + testes + auditoria de links) · Deploy na [Vercel](https://manausdev.vercel.app)

---

## 📁 Estrutura do Projeto

```text
manausdev/
├── src/
│   ├── app/                        # Rotas (App Router)
│   │   ├── layout.tsx              # Root layout com tipografia regional, SEO e tema anti-flash
│   │   ├── page.tsx                # Landing page interativa
│   │   ├── globals.css             # Design tokens Blue-Tech (claro/escuro) + estilos globais
│   │   ├── devs/                   # Diretório de devs + perfil público /devs/[username]
│   │   ├── projetos/ empresas/ vagas/ eventos/ comunidades/ noticias/
│   │   │                           # Vitrines com página de detalhe [id] (comunidades incluem os canais)
│   │   ├── dashboard/              # Painel do membro (edição de perfil e projetos)
│   │   ├── auth/                   # login, register e callback OAuth (SSR)
│   │   └── sobre/ contato/ termos/ privacidade/
│   ├── atoms/                      # Design system: átomos (Avatar, Button, Chip, Icon, Input, Link)
│   ├── molecules/                  # …moléculas (Card, StatCard, FormField, SearchInput, AvailabilityChip)
│   ├── organisms/                  # …organismos (Header, Footer, ListingGrid, ThemeToggle, CookieConsent)
│   ├── routes/                     # Templates de rota (Listing, Detail, Auth, Text)
│   ├── tokens/                     # Design tokens (colors, spacing, typography)
│   ├── components/                 # Ícones vetoriais
│   ├── lib/
│   │   ├── supabase/               # client (browser) · server (SSR c/ cookies) · public (anon p/ rotas estáticas)
│   │   ├── data/                   # source.ts (fetch no Supabase + fallback) · mock.ts (fixtures)
│   │   ├── profile-types.ts        # Matriz de permissões por tipo de perfil (fonte única com o SQL)
│   │   └── …                       # agenda, channels-meta, devs-meta, news-meta, site, env, utils
│   └── types/
│       └── database.ts             # Tipos TypeScript do schema Supabase
├── supabase/
│   ├── config.toml                 # Configuração do projeto Supabase (CLI)
│   ├── migrations/                 # Migrations versionadas (schema, RLS, triggers, índices)
│   ├── schema.sql                  # DDL completo das tabelas, RLS e triggers
│   └── seed.sql                    # Carga inicial de dados
├── scripts/                        # Scripts REST com Service Account — base do futuro appcli (NÃO REMOVER)
├── docs/adr/                       # Registro de decisões de arquitetura (ADR Log)
└── .github/workflows/ci.yml        # CI: build + testes + auditoria de links
```

---

## 🚀 Como Executar Localmente

### 1. Clonar e Instalar Dependências

```bash
git clone https://github.com/manausdev/manausdev.git
cd manausdev
npm install
```

### 2. Configurar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No painel do Supabase, acesse o **SQL Editor** e execute o script [`supabase/schema.sql`](supabase/schema.sql) — ou aplique as migrations de [`supabase/migrations/`](supabase/migrations) na ordem.
3. Opcionalmente, execute [`supabase/seed.sql`](supabase/seed.sql) para popular dados de teste.
4. Copie as variáveis de ambiente:

```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# NEXT_PUBLIC_USE_MOCK=true   # dados de demonstração — NUNCA ativar em produção
```

### 3. Desenvolver

```bash
npm run dev          # servidor de desenvolvimento em http://localhost:3000
npm test             # suite de testes (Vitest)
npm run typecheck    # verificação de tipos (tsc --noEmit)
npm run storybook    # design system em http://localhost:6006
```

### 4. Build de Produção

```bash
npm run build
npm run start
```

Ou via Docker (build + servidor na porta 3000):

```bash
docker compose up
```

---

## 🗺️ Roadmap — Community OS

A direção de longo prazo está consolidada no [ADR 0021](docs/adr/0021-community-os-domain-architecture-and-roadmap.md):

| Fase | Escopo | Status |
|:---:|---|:---:|
| 0 | Fechar o zero-deps: tokens `@theme` → `:root`, `cn()` local, remoção do Tailwind | ✅ Concluída |
| 1 | GitHub como produto (labels, discussions, issues do roadmap) | ⬜ |
| 2 | Extração incremental de `domains/` (developers primeiro) | ⬜ |
| 3 | Person & Identity — papéis com escopo, skills, experiências | ⬜ |
| 4 | Graph & Discovery — cidade × stack × disponibilidade | ⬜ |
| 5 | Reputação, badges & moderação | ⬜ |
| 6 | Notificações, API pública, PWA | ⬜ |

---

## 📜 Decisões de Arquitetura (ADRs)

Todas as decisões arquiteturais e evoluções de features são documentadas em formato ADR (Architecture Decision Records):

* Acesse o índice completo: [**`docs/adr/README.md`**](docs/adr/README.md)
* Destaques recentes: [ADR 0016](docs/adr/0016-profile-types-and-permission-matrix.md) (matriz de permissões RLS) · [ADR 0017](docs/adr/0017-css-modules-migration-icons-and-audit-findings.md) (CSS Modules) · [ADR 0018](docs/adr/0018-public-supabase-client-for-static-detail-routes.md) (cliente público p/ rotas estáticas) · [ADR 0021](docs/adr/0021-community-os-domain-architecture-and-roadmap.md) (Community OS)

---

## 🤝 Contribuindo

- [CONTRIBUTING.md](CONTRIBUTING.md) — como contribuir
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — código de conduta
- [SECURITY.md](SECURITY.md) — como reportar vulnerabilidades
- [AGENTS.md](AGENTS.md) — diretrizes para agentes de IA (regra zero-deps, scripts REST)

---

## 📜 Licença

Distribuído sob a licença **Apache License 2.0**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
