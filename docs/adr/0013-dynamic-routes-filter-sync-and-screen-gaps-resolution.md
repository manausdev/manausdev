# ADR 0013: Resolução de Gaps de Tela, Rotas Dinâmicas com SSG e Sincronização via URL

**Status:** Aceito  
**Data:** 2026-08-23  
**Autor:** Equipe ManausDev  

---

## Contexto

A auditoria técnica documentada em [`docs/gaps-screens.md`](../gaps-screens.md) identificou diversas lacunas na experiência de navegação, persistência e arquitetura da plataforma:
1. **Ausência de Rotas Dinâmicas de Detalhe:** As listagens em `/devs`, `/projetos`, `/vagas`, `/empresas`, `/eventos` e `/comunidades` possuíam dead-ends (apenas links externos parciais ou sem visualização detalhada interna).
2. **Falta de Sincronização de Filtros na URL:** Os filtros de busca e categoria eram mantidos apenas em memória local nos componentes de cliente, impedindo o compartilhamento de buscas e impactando o SEO.
3. **Tipagem Flexibilizada com `as any`:** O painel `/dashboard` utilizava casts inseguros no SDK do Supabase.
4. **Formulário de Contato Estático:** A tela `/contato` não persistia os envios em banco de dados.
5. **Estatísticas Fixas:** A Home apresentava contadores hardcoded que não refletiam o volume real de dados.
6. **Conformidade LGPD:** Ausência de componente para gestão de consentimento de cookies.

---

## Decisão

1. **Implementação de Rotas Dinâmicas com SSG (`generateStaticParams`):**
   - Criar as 6 rotas dinâmicas individuais:
     - [`src/app/devs/[username]/page.tsx`](file:///c:/Users/luann/Documents/antigravity/manausdev/src/app/devs/[username]/page.tsx)
     - [`src/app/projetos/[id]/page.tsx`](file:///c:/Users/luann/Documents/antigravity/manausdev/src/app/projetos/[id]/page.tsx)
     - [`src/app/vagas/[id]/page.tsx`](file:///c:/Users/luann/Documents/antigravity/manausdev/src/app/vagas/[id]/page.tsx)
     - [`src/app/empresas/[id]/page.tsx`](file:///c:/Users/luann/Documents/antigravity/manausdev/src/app/empresas/[id]/page.tsx)
     - [`src/app/eventos/[id]/page.tsx`](file:///c:/Users/luann/Documents/antigravity/manausdev/src/app/eventos/[id]/page.tsx)
     - [`src/app/comunidades/[id]/page.tsx`](file:///c:/Users/luann/Documents/antigravity/manausdev/src/app/comunidades/[id]/page.tsx)
   - Todas as páginas exportam `generateStaticParams()` integrando a base mock/seed para geração estática em tempo de build (`next build`), mantendo compatibilidade com o deploy headless via REST API para Firebase Hosting.

2. **Sincronização de Filtros e Busca com URL Search Params:**
   - Empregar `useSearchParams()` e `router.replace(..., { scroll: false })` encapsulados em boundaries `<Suspense>` em todos os diretórios públicos.
   - Adicionar busca textual e filtros de porte/categoria em `/empresas` e `/eventos`.

3. **Tipagem Estrita e Modelagem de Banco no Supabase:**
   - Adicionar a tabela `public.contacts` com políticas RLS em [`supabase/schema.sql`](file:///c:/Users/luann/Documents/antigravity/manausdev/supabase/schema.sql).
   - Harmonizar as interfaces `Database` em [`src/types/database.ts`](file:///c:/Users/luann/Documents/antigravity/manausdev/src/types/database.ts) eliminando `as any` no código.

4. **CRUD Completo de Projetos no Dashboard:**
   - Adicionar suporte a inserção, edição pré-populada e exclusão de projetos com confirmação no [`src/app/dashboard/page.tsx`](file:///c:/Users/luann/Documents/antigravity/manausdev/src/app/dashboard/page.tsx).

5. **Métricas Dinâmicas na Home e Banner LGPD:**
   - Consultar contadores agregados com `count: 'exact', head: true` na Home.
   - Adicionar componente [`src/components/cookie-consent.tsx`](file:///c:/Users/luann/Documents/antigravity/manausdev/src/components/cookie-consent.tsx) com persistência em `localStorage`.

---

## Consequências

### Positivas
- **Navegação Contínua e Rica:** O usuário pode navegar do card de listagem para a página completa de qualquer desenvolvedor, projeto, vaga, empresa, evento ou comunidade.
- **SEO & Compartilhamento:** URLs diretas para buscas filtradas (ex.: `/devs?skill=TypeScript&available=true`) e metadados estruturados (JSON-LD `JobPosting`).
- **Type-Safety Total:** 0 erros de tipagem no `npx tsc --noEmit`.
- **Deploy Preservado:** 42 páginas estáticas e SSG compiladas com sucesso sem quebrar a automação em `scripts/deploy-hosting-rest.js`.

---

## Referências
- [`docs/gaps-screens.md`](../gaps-screens.md)
- [`supabase/schema.sql`](../../supabase/schema.sql)
- [`src/types/database.ts`](../../src/types/database.ts)
