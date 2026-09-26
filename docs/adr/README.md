# 📜 Registro de Decisões de Arquitetura (ADR Log)

Índice central de todas as decisões arquiteturais, técnicas e visuais adotadas no projeto **ManausDev**, categorizadas por feature e evolução temporal.

---

## 📋 Sumário de Decisões

| ADR | Data | Feature / Domínio | Título | Status |
|:---:|:---:|:---|:---|:---:|
| [ADR 0001](0001-use-vanilla-html-css-js.md) | 2026-08-13 | Core / MVP | Usar HTML/CSS/JS vanilla como stack inicial do MVP | *Superado* |
| [ADR 0002](0002-use-localstorage-as-database.md) | 2026-08-13 | Persistência MVP | Usar localStorage como banco de dados do MVP | *Superado* |
| [ADR 0003](0003-design-system-css-variables.md) | 2026-08-13 | UI / Design | Design system próprio via CSS variables (Dark/Light) | *Superado* |
| [ADR 0004](0004-stateless-auth-with-localstorage.md) | 2026-08-13 | Auth MVP | Autenticação stateless simulada via localStorage | *Superado* |
| [ADR 0005](0005-simple-spa-with-hash-routing.md) | 2026-08-13 | Roteamento | SPA simples com hash routing | *Superado* |
| [ADR 0006](0006-static-site-deploy.md) | 2026-08-13 | DevOps / Deploy | Deploy como site estático | *Aceito* |
| [ADR 0007](0007-rest-api-with-service-account-and-appcli.md) | 2026-08-15 | DevOps / CLI | Automação e Deploy via REST API com Service Account | **Aceito** |
| [ADR 0008](0008-migrate-to-nextjs-and-supabase.md) | 2026-08-17 | Core / Fullstack | Migração para Next.js (App Router) e Supabase | **Aceito** |
| [ADR 0009](0009-corporate-modern-green-tech-design-system.md) | 2026-08-18 | UI / Design System | Design System Green-Tech (Corporate Modern & Bio-Organic) | **Aceito** |
| [ADR 0010](0010-project-visual-previews-and-showcase.md) | 2026-08-19 | Projetos & Showcase | Exibição de Visual Previews na Galeria e Vitrine de Projetos | **Aceito** |
| [ADR 0011](0011-previews-and-branding-for-communities-events-companies.md) | 2026-08-19 | Comunidades / Eventos / Empresas | Visual Previews e Identidade de Marca para Ecossistema | **Aceito** |
| [ADR 0012](0012-remove-firebase-tools-and-update-dependencies.md) | 2026-08-23 | DevOps / Dependências | Remoção do firebase-tools e atualização de dependências vulneráveis | **Aceito** |
| [ADR 0013](0013-dynamic-routes-filter-sync-and-screen-gaps-resolution.md) | 2026-08-23 | Navegação & Fullstack | Resolução de Gaps de Tela, Rotas Dinâmicas com SSG e Sincronização via URL | **Aceito** |
| [ADR 0014](0014-fix-critical-nextjs-rce-and-remove-dead-middleware.md) | 2026-09-25 | DevOps / Segurança | Correção de RCE crítico no Next.js e remoção de Middleware morto | **Aceito** |

---

## 🧭 Mapa de ADRs por Feature & Componente

### 1. 🏗️ Arquitetura Core & Backend
* [`ADR 0008: Migração para Next.js e Supabase`](0008-migrate-to-nextjs-and-supabase.md)
  * Adoção de Next.js 16 (App Router), TypeScript, SSR cookies e Supabase PostgreSQL com RLS.
* [`ADR 0007: Automação e Deploy via REST API (appcli roadmap)`](0007-rest-api-with-service-account-and-appcli.md)
  * Scripts REST em `scripts/` sem dependência de login interativo.
* [`ADR 0013: Resolução de Gaps de Tela, Rotas Dinâmicas com SSG e Sincronização via URL`](0013-dynamic-routes-filter-sync-and-screen-gaps-resolution.md)
  * Implementação de rotas dinâmicas SSG, sincronização de URL search params, persistência de contatos e CRUD completo no dashboard.

### 2. 🎨 Design System & Identidade Visual
* [`ADR 0009: Design System Green-Tech (Corporate Modern & Bio-Organic)`](0009-corporate-modern-green-tech-design-system.md)
  * Paleta semântica com Deep Amazon Green (`#003527`), Leaf Green (`#006c49`), River Blue (`#00314a`), tipografia Sora + Inter e texturas bio-orgânicas.

### 3. 🚀 Vitrines & Módulos Visuais
* [`ADR 0010: Previews Visuais em Projetos`](0010-project-visual-previews-and-showcase.md)
  * Headers visuais com screenshots, fallback temático com padrão geométrico e suporte a preview no Dashboard.
* [`ADR 0011: Previews e Logotipos para Comunidades, Eventos e Empresas`](0011-previews-and-branding-for-communities-events-companies.md)
  * Capas fotográficas para meetups/hackathons, contadores de comunidade e logotipos dedicados para empresas locais.

---

## 📌 Padrão para Criação de Novos ADRs

Ao criar uma nova decisão arquitetural ou feature significativa, adicione um novo arquivo com o padrão `docs/adr/NNNN-titulo-da-feature.md` e registre-o na tabela acima.
