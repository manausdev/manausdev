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
| [ADR 0009](0009-corporate-modern-green-tech-design-system.md) | 2026-08-18 | UI / Design System | Design System Green-Tech (Corporate Modern & Bio-Organic) | *Superado* |
| [ADR 0010](0010-project-visual-previews-and-showcase.md) | 2026-08-19 | Projetos & Showcase | Exibição de Visual Previews na Galeria e Vitrine de Projetos | **Aceito** |
| [ADR 0011](0011-previews-and-branding-for-communities-events-companies.md) | 2026-08-19 | Comunidades / Eventos / Empresas | Visual Previews e Identidade de Marca para Ecossistema | **Aceito** |
| [ADR 0012](0012-remove-firebase-tools-and-update-dependencies.md) | 2026-08-23 | DevOps / Dependências | Remoção do firebase-tools e atualização de dependências vulneráveis | **Aceito** |
| [ADR 0013](0013-dynamic-routes-filter-sync-and-screen-gaps-resolution.md) | 2026-08-23 | Navegação & Fullstack | Resolução de Gaps de Tela, Rotas Dinâmicas com SSG e Sincronização via URL | **Aceito** |
| [ADR 0014](0014-fix-critical-nextjs-rce-and-remove-dead-middleware.md) | 2026-09-25 | DevOps / Segurança | Correção de RCE crítico no Next.js e remoção de Middleware morto | **Aceito** |
| [ADR 0015](0015-rebrand-blue-tech-palette-and-dark-mode.md) | 2026-09-29 | UI / Design System | Rebrand para a paleta Blue-Tech com modo claro/escuro | **Aceito** |
| [ADR 0016](0016-profile-types-and-permission-matrix.md) | 2026-09-29 | Auth / RLS | Tipos de perfil e matriz de permissões por tipo de conta | **Aceito** |
| [ADR 0019](0019-favicon-from-brand-symbol.md) | 2026-09-30 | UI / Identidade Visual | Favicon a partir do símbolo da marca | **Aceito** |

---

## 🧭 Mapa de ADRs por Feature & Componente

### 1. 🏗️ Arquitetura Core & Backend
* [`ADR 0008: Migração para Next.js e Supabase`](0008-migrate-to-nextjs-and-supabase.md)
  * Adoção de Next.js 16 (App Router), TypeScript, SSR cookies e Supabase PostgreSQL com RLS.
* [`ADR 0007: Automação e Deploy via REST API (appcli roadmap)`](0007-rest-api-with-service-account-and-appcli.md)
  * Scripts REST em `scripts/` sem dependência de login interativo.
* [`ADR 0013: Resolução de Gaps de Tela, Rotas Dinâmicas com SSG e Sincronização via URL`](0013-dynamic-routes-filter-sync-and-screen-gaps-resolution.md)
  * Implementação de rotas dinâmicas SSG, sincronização de URL search params, persistência de contatos e CRUD completo no dashboard.
* [`ADR 0016: Tipos de perfil e matriz de permissões por tipo de conta`](0016-profile-types-and-permission-matrix.md)
  * Coluna `profile_type` (`dev` | `empresa` | `admin`) separada do cargo textual `role`, RLS por tipo com helpers `security definer`, escrita exigindo autoria (`auth.uid()`), e trigger anti-escalação de `profile_type`/`is_admin`.

* [`ADR 0018: Cliente Supabase público para rotas de detalhe estáticas`](0018-public-supabase-client-for-static-detail-routes.md)
  * `createPublicClient` (anônimo, sem cookies) para leituras públicas em rotas com `generateStaticParams`, corrigindo os 500 nos detalhes e o link `/projetos/1` inventado na home.

### 2. 🎨 Design System & Identidade Visual
* [`ADR 0019: Favicon a partir do símbolo da marca`](0019-favicon-from-brand-symbol.md)
  * `src/app/favicon.ico` (16, 32 e 48 px) só com o símbolo do M, PNGs internos em RGBA (em RGB a home responde 500) e fonte em `public/assets/icone-manausdev.png`.
* [`ADR 0015: Rebrand para a paleta Blue-Tech com modo claro/escuro`](0015-rebrand-blue-tech-palette-and-dark-mode.md)
  * Paleta oficial extraída do logo (`#0073FD`, `#009BFD`, `#02B8B5`, `#4BD76D`), tokens CSS semânticos, dark mode via classe `.dark` + `ThemeToggle` e gradiente da marca como utility.
* [`ADR 0009: Design System Green-Tech (Corporate Modern & Bio-Organic)`](0009-corporate-modern-green-tech-design-system.md)
  * *Superado pelo ADR 0015.* Paleta semântica com Deep Amazon Green (`#003527`), Leaf Green (`#006c49`), River Blue (`#00314a`), tipografia Sora + Inter e texturas bio-orgânicas.
* [`ADR 0017: Migração para CSS Modules — ícones com size, chip de disponibilidade único e limites da auditoria`](0017-css-modules-migration-icons-and-audit-findings.md)
  * Prop `size` nos ícones, `AvailabilityChip` como fonte única, correções de layout (hero, empresas) e o que o `bml audit` não enxerga.

### 3. 🚀 Vitrines & Módulos Visuais
* [`ADR 0010: Previews Visuais em Projetos`](0010-project-visual-previews-and-showcase.md)
  * Headers visuais com screenshots, fallback temático com padrão geométrico e suporte a preview no Dashboard.
* [`ADR 0011: Previews e Logotipos para Comunidades, Eventos e Empresas`](0011-previews-and-branding-for-communities-events-companies.md)
  * Capas fotográficas para meetups/hackathons, contadores de comunidade e logotipos dedicados para empresas locais.

---

## 📌 Padrão para Criação de Novos ADRs

Ao criar uma nova decisão arquitetural ou feature significativa, adicione um novo arquivo com o padrão `docs/adr/NNNN-titulo-da-feature.md` e registre-o na tabela acima.
