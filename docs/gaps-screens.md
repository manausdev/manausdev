# 📋 Mapeamento e Análise de Gaps por Tela — ManausDev

**Data de Atualização:** 2026-08-23  
**Versão do Sistema:** Next.js 16 (App Router) • Supabase BaaS (PostgreSQL + RLS) • Tailwind CSS v4  
**Objetivo:** Mapear minuciosamente todas as telas do repositório, auditar o status de integração com o Supabase/Backend e registrar as resoluções de arquitetura e navegação implementadas.

---

## 🧭 1. Visão Geral da Arquitetura Atual

| Componente / Camada | Status Atual | Detalhamento Técnico |
|---|:---:|---|
| **Ambiente Supabase** | ✅ Estruturado | Schema DDL (`supabase/schema.sql`) com RLS em todas as tabelas (incluindo `contacts`), Seeds (`supabase/seed.sql`) e fallback gracioso local. |
| **Camada de Dados Client-side** | ✅ Ativa | Telas públicas consom `createBrowserClient` tipado com `Database` e fallback automático para `MOCK_*` (`src/lib/data/mock.ts`). |
| **Camada de Dados Server-side** | ✅ Ativa | `src/app/page.tsx` consome `createServerClient` em Server Component para contagens dinâmicas e pré-carregamento. |
| **Autenticação (Auth)** | ✅ Funcional | Fluxos de login/cadastro com email/senha e OAuth GitHub via `@supabase/ssr`, sanitização de username, aceite de termos e suporte a `redirectedFrom`. |
| **Proteção de Rotas** | ✅ Server + Client | `src/middleware.ts` verifica sessão Supabase via `@supabase/ssr` para `/dashboard/:path*` e redireciona para `/auth/login?redirectedFrom=...` quando não autenticado. O redirect client-side em `src/app/dashboard/page.tsx` permanece como fallback. Proteção real de dados continua sendo RLS no Supabase. |
| **Mutação de Dados (Writes)** | ✅ Completo | `/dashboard` executa `upsert` em `profiles`, `insert`, `update` e `delete` em `projects` com tipagem 100% estrita sem `as any`. |
| **Páginas de Detalhe Dinâmicas** | ✅ Implementadas | Rotas `/devs/[username]`, `/projetos/[id]`, `/vagas/[id]`, `/empresas/[id]`, `/eventos/[id]` e `/comunidades/[id]` ativas com `generateStaticParams`. |
| **Sincronização de Filtros (URL)** | ✅ Implementada | Busca e filtros refletem nos Search Params (`/devs?skill=...`, `/projetos?stack=...`, `/vagas?type=...`, etc.) com navegação sem reload. |
| **Contato & Persistência** | ✅ Conectado | Formulário `/contato` integrado com inserção na tabela `public.contacts` e feedback de sucesso. |
| **Conformidade LGPD** | ✅ Ativa | Banner de consentimento de cookies (`CookieConsent`) com persistência no `localStorage`. |

---

## 🖥️ 2. Auditoria Detalhada por Tela

---

### 1. `/` — Página Inicial (Home)
* **Arquivo:** `src/app/page.tsx`
* **Tipo:** Server Component (SSR / Async)
* **Status:** ✅ Resolvido
- [x] **Métricas Dinâmicas:** Contadores reais/agregados de devs, projetos, eventos, comunidades e vagas.
- [x] **Cards Clicáveis:** Links diretos para os perfis dos devs (`/devs/[username]`), projetos (`/projetos/[id]`), vagas (`/vagas/[id]`) e eventos (`/eventos/[id]`).

---

### 2. `/devs` — Diretório de Desenvolvedores
* **Arquivo:** `src/app/devs/page.tsx`
* **Tipo:** Client Component com `<Suspense>`
* **Status:** ✅ Resolvido
- [x] **Página de Perfil do Desenvolvedor:** Rota dinâmica `src/app/devs/[username]/page.tsx` com bio, skills, projetos vinculados e links sociais.
- [x] **Sincronização de Filtros via URL:** Filtros de busca, skill e disponibilidade sincronizados com search params (`/devs?skill=TypeScript&available=true`).
- [x] **Navegação Integrada:** Cards com link direto para o perfil público.

---

### 3. `/projetos` — Galeria de Projetos
* **Arquivo:** `src/app/projetos/page.tsx`
* **Tipo:** Client Component com `<Suspense>`
* **Status:** ✅ Resolvido
- [x] **Página de Detalhes do Projeto:** Rota dinâmica `src/app/projetos/[id]/page.tsx` com screenshots, descrição, stack e autor vinculado.
- [x] **Sincronização de Filtros:** Busca textual e seleção de tecnologia refletidas na URL (`/projetos?stack=Next.js`).

---

### 4. `/vagas` — Mural de Vagas
* **Arquivo:** `src/app/vagas/page.tsx`
* **Tipo:** Client Component com `<Suspense>`
* **Status:** ✅ Resolvido
- [x] **Página de Detalhe da Vaga:** Rota dinâmica `src/app/vagas/[id]/page.tsx` com Structured Data (`JobPosting` schema.org) e requisitos detalhados.
- [x] **Sincronização de Filtros:** Filtro de tipo (CLT/PJ/Estágio) e toggle de vagas remotas integrados à URL (`/vagas?remote=true&type=CLT`).

---

### 5. `/empresas` — Diretório de Empresas
* **Arquivo:** `src/app/empresas/page.tsx`
* **Tipo:** Client Component com `<Suspense>`
* **Status:** ✅ Resolvido
- [x] **Busca e Filtros:** Barra de pesquisa por nome/setor e seletor por porte de empresa (10-50, 50-200, 500+).
- [x] **Página de Detalhe da Empresa:** Rota dinâmica `src/app/empresas/[id]/page.tsx` com visão institucional e vagas abertas da organização.

---

### 6. `/eventos` — Agenda & Hackathons
* **Arquivo:** `src/app/eventos/page.tsx`
* **Tipo:** Client Component com `<Suspense>`
* **Status:** ✅ Resolvido
- [x] **Filtros por Tipo & Busca:** Busca textual e filtros por categoria (Meetup, Hackathon, Conference).
- [x] **Página de Detalhe do Evento:** Rota dinâmica `src/app/eventos/[id]/page.tsx` com data formatada, localização e link de inscrição.

---

### 7. `/comunidades` — Comunidades
* **Arquivo:** `src/app/comunidades/page.tsx`
* **Tipo:** Client Component
* **Status:** ✅ Resolvido
- [x] **Página de Detalhe da Comunidade:** Rota dinâmica `src/app/comunidades/[id]/page.tsx` com canais de comunicação (Discord, WhatsApp, Telegram) e número de membros.

---

### 8. `/auth/login` — Login
* **Arquivo:** `src/app/auth/login/page.tsx`
* **Tipo:** Client Component com `<Suspense>`
* **Status:** ✅ Resolvido
- [x] **Redirecionamento Inteligente:** Consome `?redirectedFrom=` e retorna o usuário à tela que ele tentava acessar antes da autenticação.
- [x] **Feedback de Erro:** Exibição clara de mensagens de credenciais inválidas ou falha de OAuth.

---

### 9. `/auth/register` — Cadastro
* **Arquivo:** `src/app/auth/register/page.tsx`
* **Tipo:** Client Component
* **Status:** ✅ Resolvido
- [x] **Sanitização de Username:** Formatação em tempo real para lowercase sem caracteres inválidos.
- [x] **Aceite de Termos:** Checkbox obrigatório para aceitação dos Termos de Uso e Política de Privacidade.
- [x] **Metadados de Perfil:** Envio de dados para acionamento da trigger `handle_new_user()`.

---

### 10. `/dashboard` — Painel do Desenvolvedor
* **Arquivo:** `src/app/dashboard/page.tsx`
* **Tipo:** Client Component protegido
* **Status:** ✅ Resolvido
- [x] **Tipagem 100% Estrita:** Remoção de todos os casts `as any` em favor dos tipos do `Database`.
- [x] **CRUD Completo de Projetos:** Criação (insert), Edição (update) e Exclusão (delete) com modais e feedback instantâneo.
- [x] **Gerenciamento de Perfil:** Atualização de biografia, especialidade, habilidades, links e disponibilidade.

---

### 11. `/contato` — Atendimento & Parcerias
* **Arquivo:** `src/app/contato/page.tsx`
* **Tipo:** Client Component
* **Status:** ✅ Resolvido
- [x] **Persistência no Banco:** Inserção estruturada na tabela `public.contacts`.
- [x] **Feedback de Estado:** Loading, alertas de erro e tela de confirmação personalizada com opção de novo envio.

---

### 12. Componentes Globais & LGPD
* **Arquivos:** `src/app/layout.tsx`, `src/components/cookie-consent.tsx`
* **Status:** ✅ Resolvido
- [x] **Cookie Consent:** Banner de consentimento com persistência local em conformidade com a LGPD.
