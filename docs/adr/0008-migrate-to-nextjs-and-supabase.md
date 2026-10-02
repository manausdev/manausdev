# ADR 0008: Migração da plataforma para Next.js (App Router) e Supabase

**Status:** Aceito  
**Data:** 2026-08-18  
**Autor:** Equipe ManausDev  

## Contexto

A versão inicial da plataforma ManausDev utilizava HTML, CSS e JavaScript vanilla com dados em mock/localStorage. Conforme a comunidade cresceu e novas necessidades surgiram (autenticação real, banco de dados relacional com Row Level Security, SSR, SEO otimizado e painel do usuário dinâmico), fez-se necessária a evolução da stack para um framework moderno, escalável e tipado.

## Decisão

1. **Next.js 16 (App Router) com React 19 e TypeScript:**
   - Adotar o Next.js App Router em `src/app/` como base de frontend e SSR/SSG.
   - Utilizar TypeScript para tipagem estática do schema do banco, componentes e estados.
   - Utilizar Tailwind CSS v4 mantendo a identidade visual Cyber-Amazônica descrita no `DESIGN.md`.

2. **Supabase como Backend-as-a-Service (BaaS) e PostgreSQL:**
   - Integrar `@supabase/ssr` e `@supabase/supabase-js` para autenticação (Email/Senha e OAuth GitHub) e consultas ao banco.
   - Definir schema relacional PostgreSQL em `supabase/schema.sql` com tabelas para perfis (`profiles`), projetos (`projects`), empresas (`companies`), comunidades (`communities`), eventos (`events`) e vagas (`jobs`).
   - Aplicar políticas de Row Level Security (RLS) para proteção de escrita pelos proprietários e leitura pública.
   - Criar triggers PostgreSQL para criação automática de perfil de usuário ao registrar no Supabase Auth.
   - Fornecer seed inicial em `supabase/seed.sql` e fallback local em `src/lib/data/mock.ts`.

3. **Compatibilidade de Deploy e Preservação de Scripts:**
   - Habilitar static export no Next.js (`output: 'export'`, `distDir: 'dist'`) para integração contínua com os scripts de deploy REST existentes (`scripts/deploy-hosting-rest.js`), preservando as regras do `AGENTS.md`.

## Consequências

### Positivas
- Código modularizado, reutilizável e componentizado em React com TypeScript.
- Autenticação e persistência de dados em produção via Supabase sem necessidade de infraestrutura de servidor customizada.
- Busca e filtragem instantânea nos diretórios de desenvolvedores, projetos e vagas.
- Preservação da automação de deploy headless via REST API para Firebase Hosting.

### Negativas
- Aumento no tamanho do `node_modules` e tempo de build em comparação ao HTML vanilla.

## Referências

- [`supabase/schema.sql`](../../supabase/schema.sql)
- [`supabase/seed.sql`](../../supabase/seed.sql)
- [`src/lib/supabase/client.ts`](../../src/lib/supabase/client.ts)
- [`src/lib/supabase/server.ts`](../../src/lib/supabase/server.ts)
- [`AGENTS.md`](../../AGENTS.md)
