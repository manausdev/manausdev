# ADR 0021: Community OS — arquitetura orientada a domínios e roadmap

**Status:** Aceito (documento de visão e sequência; cada fase a partir da 3 abre ADR próprio antes de executar)
**Data:** 2026-09-30
**Autor:** Equipe ManausDev

## Contexto

O ManausDev saiu da fase de "site de comunidade". Hoje é plataforma fullstack:
Next.js 16 (App Router) + React 19 + TypeScript + Supabase (PostgreSQL, RLS,
triggers, migrations), autenticação, diretório de devs com filtros na URL,
empresas, projetos, vagas, eventos, comunidades, notícias, dashboard e CI com
build + 103 testes + auditoria de links.

A revisão estratégica contra concorrentes (Wellfound, LinkedIn, Stack Overflow,
Forem, GitHub, Hashnode, Luma, Meetup, Product Hunt, Craftfolio) priorizou 10
gaps — quatro já foram fechados no schema pela migração
`20260929130000_dev_directory_upgrade.sql`:

| Gap da análise | Estado |
|---|---|
| Disponibilidade booleana → 3 estados | ✅ `availability` (`open`/`offers`/`busy`) |
| Sem cidade normalizada | ✅ `city` + índice |
| Sem senioridade | ✅ `seniority` (`junior`/`pleno`/`senior`/`lead`) |
| Email público em `profiles` (LGPD) | ✅ coluna removida; e-mail vive em `auth.users` |
| Filtro cidade × stack × disponibilidade | 🔶 índices criados; query e UI na Fase 4 |
| Prova social, badges, ordenação, "membro desde" | ⬜ Fases 3–5 |
| Moderação, notificações, API pública, PWA | ⬜ Fases 5–6 |

O que permanece aberto não é feature — é **arquitetura**. A organização atual é
por tipo de arquivo:

```
src/
├── app/          → roteamento + fetch + UI de página
├── atoms/        ┐
├── molecules/    ├ design system atômico (CSS Modules, zero deps)
├── organisms/    │
├── routes/       ┘ templates de listagem
├── components/   → ícones
├── lib/          → data/source.ts (proto-repository), supabase, utils, profile-types
├── tokens/       → design tokens
└── types/        → tipos do banco
```

Funciona, mas `app/` concentra roteamento, acesso a dados e regras. Devs,
empresas, vagas, eventos, projetos e comunidades têm regras de negócio
diferentes e hoje dividem o mesmo `source.ts` genérico. A revisão propôs
evoluir para **domínios**, modelo **Person** e **grafo** — este ADR refina essa
visão em decisão + roadmap executável.

Fatos que ancoram a sequência (auditoria de 2026-09-30):

- **Zero-deps a um passo do fim.** Dos 37 tokens consumidos pelos CSS Modules,
  todos já são custom properties puras em `:root`/`.dark` — exceto
  `--shadow-elevated`, que só existe dentro de `@theme inline`. `className`
  raw resta apenas em `.stories`/`.test` e `icons.tsx`. `cn()` (clsx +
  tailwind-merge) permanece em 16 arquivos.
- **Produção saudável.** As rotas do run vermelho do PR #70 respondem 200; os
  500 das `[id]` foram resolvidos pelo ADR 0018 (`createPublicClient`) —
  `/empresas/1` hoje dá 404 limpo (ID inexistente), não 500.
- **RLS como produto.** ADR 0016 (`profile_type` + matriz de permissões) já
  separa autorização de cargo textual.

## Decisão

### 1. Posicionamento: Community OS, não LinkedIn regional

ManausDev é a **infraestrutura digital da comunidade tecnológica do Amazonas**:
identidade profissional → comunidade → projetos/empresas → eventos/vagas →
contribuições → reputação. O diferencial competitivo é o **grafo local** —
"quem trabalha com Rust em Manaus" não tem resposta em plataforma nenhuma, e
grafo alimentado por comunidade real é difícil de replicar. Feed global,
network impessoal e "LinkedIn de pontos" ficam fora de escopo.

### 2. Arquitetura alvo: orientada a domínios

```
src/
├── app/                        → casca de roteamento
│   ├── (public)/ (auth)/ (dashboard)/ api/
├── domains/
│   ├── identity/         → Person, papéis, sessão
│   ├── developers/       → model, repository, service, queries, mutations, schemas
│   ├── companies/ projects/ jobs/ events/ communities/
│   ├── contributions/   → reputação, badges
│   ├── moderation/       → aprovação, denúncias, verificação
│   └── notifications/
├── components/           → ui/ layout/ shared/ (evolução de atoms/molecules/organisms/routes)
├── infrastructure/
│   ├── supabase/         → client, server, repositories
│   ├── email/
│   └── storage/
└── lib/                  → utilitários sem domínio
```

Regras de extração:

- **Incremental, nunca big-bang:** um domínio por PR, sem mudança de
  comportamento; `app/` atual funciona durante toda a migração.
- **`source.ts` e mock-data são absorvidos** pelo repository do domínio — o
  proto-repository vira repository de verdade.
- **Supabase não vaza de `infrastructure/`:** domínio não importa
  `@supabase/ssr`; trocar de provedor no futuro não desmonta o domínio.
- **Zero deps permanece lei** (AGENTS.md): nada nesta arquitetura exige
  biblioteca nova.

### 3. Identidade: Person, não User → Profile

Uma pessoa acumula papéis — developer, founder, researcher, community member,
project maintainer, event organizer — em vez de "escolher um tipo de conta".
`profile_type` (ADR 0016) **permanece como discriminador de permissão RLS**
(`dev`/`empresa`/`admin`); papéis declarativos viram **dados de domínio** com
escopo (mantenedor *deste* projeto, organizador *deste* evento), nunca coluna
de autorização.

### 4. Grafo como feature central

As 6 FKs do schema já existem (`projects.author_id`, `events.organizer_id`,
`jobs.posted_by`, `companies.created_by`…). O grafo é materializar as arestas
como produto:

```
Person ── trabalha em ──→ Empresa
       ├── mantém ──────→ Projeto
       ├── participa de → Comunidade
       ├── vai a ───────→ Evento
       ├── contribui ──→ Open Source
       └── possui ──────→ Skill
```

A query de diferenciação já tem índice no banco:
`/devs?stack=react&cidade=manaus&disponibilidade=aberto`.

### 5. Stack mantida

Next + Supabase + PostgreSQL permanecem. O ganho está em modelagem de domínio,
discovery, grafo e governança — não em trocar de infraestrutura.

### 6. GitHub como produto open-source

Labels (🐛 bug, ✨ feature, 🧠 proposal, 🏘️ community, 🛡️ moderation, 🔧
infrastructure), Discussions (Geral, Ideias, Eventos, Jobs, Projetos,
Comunidades), issues rastreando este roadmap e README com CTAs de exploração
no topo.

## Roadmap

### Fase 0 — Estabilizar (em andamento)

Fechar a dívida zero-deps antes de abrir front arquitetural novo:

- [x] 500 das `[id]` — resolvido pelo ADR 0018
- [x] Broken links do run do PR #70 — não se reproduzem (200 em produção)
- [ ] `--shadow-elevated` (e os 3 shadows irmãos) de `@theme` → `:root` como
      custom properties puras
- [ ] `cn()` local (concat + filtro de falsy) nos 16 arquivos; `clsx` e
      `tailwind-merge` fora
- [ ] Remover `@import "tailwindcss"`, `@custom-variant`, `@theme`, `@utility`,
      `postcss.config.mjs` e as devDeps correspondentes
- [ ] `types/database.ts`: `Relationships: []` → FKs reais (nested select
      type-safe — pré-requisito do grafo)

**Saída:** build + 103 testes + CI verdes; zero utilitários Tailwind; zero deps
além de `next`/`react`/`react-dom`.

### Fase 1 — GitHub como produto

Labels, Discussions, issues do roadmap (um épico por fase), README com CTAs.
**Saída:** roadmap rastreável; caminho de contribuição claro para a comunidade.

### Fase 2 — Extração incremental de `domains/`

`developers` primeiro: `model.ts`, `repository.ts` (absorve `source.ts` +
mock), `service.ts`, `queries.ts`, `mutations.ts`, `schemas.ts`, mais
`infrastructure/supabase/{client,server,repositories}`. Depois `companies`,
`projects`, `jobs`, `events`, `communities` — um por PR.
**Saída:** `app/` sem fetch direto; domínio testável isolado.

### Fase 3 — Person & Identity (exige ADR próprio)

Migração de schema: papéis com escopo, skills/experiences como tabelas,
"membro desde", prova social no card (N projetos · M eventos). RLS acompanha.
**Saída:** o perfil mostra a pessoa inteira, não só o cargo.

### Fase 4 — Graph & Discovery (exige ADR próprio)

Query combinada cidade × stack × disponibilidade na UI, multi-select de skills
com contagem, ordenação (relevância/novidade) e páginas-resposta ("Quem
trabalha com Rust em Manaus?", "Quais empresas contratam React?").
**Saída:** a URL de diferenciação funciona de ponta a ponta.

### Fase 5 — Reputação, badges & moderação (exige ADR próprio)

Badges com critério público (estilo Hashnode), reputação ligada a contribuição
real (eventos atendidos, projetos publicados), workflow de
aprovação/denúncia/verificação.
**Saída:** membro ativo é distinguível de cadastro inativo.

### Fase 6 — Plataforma (exige ADR próprio)

Notificações (seguir projeto/evento/comunidade/vaga), API pública, PWA.
**Saída:** a comunidade constrói em cima do ManausDev.

## O que não faremos

- **LinkedIn regional** — sem feed, sem network global, sem pitch de recruiter.
- **Trocar stack** — Next + Supabase atendem; o custo estaria na migração, não
  no ganho.
- **Pontuação sem lastro** — gamificação leve, sempre com critério público e
  ligada a contribuição real.

## Consequências

- **Positivas:** diferencial difícil de replicar (grafo local); RLS e schema já
  preparados (ADR 0016 + `dev_directory_upgrade`); extração incremental não
  trava o produto; zero deps preservado.
- **Negativas:** duas arquiteturas coexistem durante a Fase 2 (custo de
  contexto); Fases 3+ são migrações de schema com rework de RLS; o roadmap
  compete por atenção com bugs de produção — Fase 0 é pré-requisito.
- **Riscos:** churn se domínios forem extraídos antes do zero-deps fechar;
  escopo da Fase 3 inflar sem ADR; confusão entre `profile_type` (autorização)
  e papéis (declaração) — mitigada na seção 3.
- **Governança:** este documento fixa direção e sequência, não detalhe de
  implementação. Fase a partir da 3 sem ADR próprio não entra em execução.
