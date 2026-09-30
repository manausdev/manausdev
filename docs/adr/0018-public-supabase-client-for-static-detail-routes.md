# ADR 0018: Cliente Supabase público para rotas de detalhe estáticas

**Status:** Aceito
**Data:** 2026-09-30
**Autor:** Equipe ManausDev

## Contexto

O job `Verificar Links Quebrados` do CI (`linkinator` sobre `https://manausdev.vercel.app`)
falhou com 7 links quebrados. Todos respondiam **HTTP 500**: `/projetos/1`, três
`/vagas/<uuid>` e três `/eventos/<uuid>`. O job rastreia o deploy de produção, então o
defeito já existia na `main` e não vinha do PR em andamento.

Reproduzindo com `npm run build && npm start`, **todas** as rotas de detalhe (`projetos`,
`vagas`, `eventos`, `empresas`, `comunidades`) davam 500 para qualquer id, inclusive ids
inexistentes, que deveriam dar 404. O log mostrava:

```
Error: Page changed from static to dynamic at runtime /projetos/zzz, reason: cookies
```

Causas:

1. `fetchById` e `fetchIdsForStaticParams` (`src/lib/data/source.ts`) e a página
   `empresas/[id]` usavam `createClient` de `src/lib/supabase/server.ts`, que chama
   `cookies()` de `next/headers`. Essas rotas têm `generateStaticParams` e, portanto, são
   estáticas; usar uma API dinâmica em tempo de execução faz o Next lançar o erro acima.
   As rotas `/devs/[username]`, que são dinâmicas, não sofriam do problema.
2. `src/app/page.tsx` exibia, sem projetos reais, um card "ManausHub" com link para
   `/projetos/1`. Além de ser conteúdo inventado (o oposto do que o commit `ccf24c3` já
   tentava garantir), o link levava a uma rota que, mesmo corrigida, responderia 404 e
   continuaria reprovando o verificador.

## Decisão

### Cliente anônimo para leituras públicas

Criar `src/lib/supabase/public.ts` com `createPublicClient()`, baseado em
`@supabase/supabase-js` (dependência já existente), sem cookies e com
`persistSession: false`. Ele é usado por `lib/data/source.ts` e por `empresas/[id]`.

A separação passa a ser explícita:

| Cliente | Arquivo | Quando usar |
|---|---|---|
| Público (anônimo) | `lib/supabase/public.ts` | Leituras de dados públicos em Server Components, inclusive rotas com `generateStaticParams` |
| Servidor (sessão) | `lib/supabase/server.ts` | Leituras que dependem do usuário logado; exige rota dinâmica |
| Browser | `lib/supabase/client.ts` | Componentes cliente |

Não há perda de segurança: `projects`, `jobs`, `companies`, `events` e `communities` têm
policy `for select using (true)` em `supabase/schema.sql`, e o RLS continua sendo a
proteção real dos dados.

### Home sem conteúdo inventado

A seção "Projetos Feitos no Amazonas" só é renderizada quando `projects.length > 0`. O card
em destaque usa o primeiro projeto real, sem título, descrição ou id de fallback.

## Verificação

- Build de produção local: ids inexistentes em `projetos`, `vagas`, `eventos`, `empresas` e
  `comunidades` retornam **404** (antes: 500), e o log não registra mais "static to dynamic".
- `linkinator http://localhost:3000 --recurse` (mesmo comando do CI, apontado para o build
  local): 51 links, nenhum quebrado. A home não contém mais `/projetos/1` nem "ManausHub".
- Typecheck e 103 testes passam.

## Consequências

- **Positivas:** páginas de detalhe deixam de responder 500; ids inexistentes dão 404 com a
  página `not-found`; a home não inventa conteúdo.
- **Negativas:** quem escrever uma nova rota com `generateStaticParams` precisa lembrar de
  usar `createPublicClient`; usar `server.ts` reintroduz o 500. Uma futura ADR pode impor
  isso com um teste ou regra de lint.
- **Limite da verificação:** sem as variáveis `NEXT_PUBLIC_SUPABASE_URL` e
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` o cliente cai no placeholder e as listas ficam vazias.
  Não foi possível testar localmente os detalhes com uuid real; a confirmação final é o
  CI rodando contra a produção depois do deploy.
- **Escopo do CI:** o job de links valida a produção, não o PR. Enquanto a correção não for
  mergeada e publicada, o job continua falhando, mesmo com o código já corrigido.
