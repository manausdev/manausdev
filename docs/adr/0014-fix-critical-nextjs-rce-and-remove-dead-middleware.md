# ADR 0014: Correção de RCE crítico no Next.js e remoção de Middleware morto

**Status:** Aceito
**Data:** 2026-09-25
**Autor:** Equipe ManausDev

## Contexto

Duas dívidas técnicas foram encontradas em auditoria, não relacionadas entre si, mas
corrigidas na mesma passagem:

### 1. `npm audit` reportava 2 vulnerabilidades (1 alta, 1 crítica)

```
next  16.0.0 - 16.3.2
Severity: critical
Next.js: Unauthenticated Remote Code Execution on windows-hosted servers
Next.js: Unauthenticated Remote Code Execution in Image Optimization API (AVIF)

sharp  <0.35.4
Severity: high
Vulnerabilities in libheif (GHSA-g89c-p67h-r497, GHSA-2jg2-4ch7-h545)
```

O `package.json` fixava `"next": "^16.3.2"` — exatamente dentro da faixa vulnerável ao RCE
não autenticado. O fix já estava disponível: o Dependabot havia aberto 10 PRs entre
2026-09-09 e 2026-09-17, todas patch/minor, incluindo o bump de `next` para `16.3.5`, e
nenhuma tinha sido mergeada.

### 2. `src/middleware.ts` nunca executa em produção

`next.config.mjs` define `output: 'export'` desde a migração para Next.js (ADR 0008). O
próprio `next build` emite o aviso: *"Statically exporting a Next.js application via
`next export` disables API routes and middleware."* — e a rota é listada como
`ƒ Proxy (Middleware)`, não como middleware ativo.

`docs/gaps-screens.md` afirmava **"Proteção de Rotas (Middleware): ✅ Funcional"**,
descrevendo `src/middleware.ts` + `src/lib/supabase/middleware.ts` interceptando
`/dashboard` e escrevendo `?redirectedFrom=`. Isso nunca rodou em produção: com
`output: 'export'` não existe servidor para executar middleware. A única escrita de
`redirectedFrom` do código inteiro estava dentro do `updateSession()` morto.

A proteção real de `/dashboard` sempre foi o `useEffect` client-side em
`src/app/dashboard/page.tsx`, que chama `supabase.auth.getUser()` e redireciona para
`/auth/login` — sem nunca passar `redirectedFrom`, tornando o parâmetro lido em
`src/app/auth/login/page.tsx` sempre vazio na prática.

## Decisão

1. **Atualizar as 12 dependências** cobertas pelos 10 PRs do Dependabot de uma vez:
   `next` `16.3.2→16.3.5`, `@supabase/supabase-js` `2.112.3→2.116.0`, `@supabase/ssr`
   `0.12.4→0.12.7`, `react`/`@types/react` `19.2→19.3`, `react-dom`/`@types/react-dom`
   `19.2→19.3`, `lucide-react` `1.33→1.46`, `tailwind-merge` `3.6→3.7`, `postcss`
   `8.5.26→8.5.28`, `autoprefixer` `10.5.4→10.6.0`, `@types/node` `26.2.0→26.5.1`.
   Nenhum bump de major; nenhuma mudança de API esperada.
2. **Remover `src/middleware.ts` e `src/lib/supabase/middleware.ts`** como código morto.
   Não há outro consumidor de `updateSession()`.
3. **Fazer o `redirectedFrom` funcionar de fato**: o `useEffect` de
   `src/app/dashboard/page.tsx` agora redireciona para
   `/auth/login?redirectedFrom=/dashboard` em vez de `/auth/login` puro. Como
   `/dashboard` é a única rota protegida hoje, o valor é fixo, mas o mecanismo passa a
   funcionar de ponta a ponta e fica pronto para futuras rotas protegidas.
4. **Corrigir `docs/gaps-screens.md`**: a linha de "Proteção de Rotas (Middleware)"
   passa a descrever a realidade — proteção client-side, RLS do Supabase como camada
   real de segurança de dados, Middleware removido.

## Consequências

- `npm audit` passou de **2 vulnerabilidades (1 alta, 1 crítica)** para **0**.
- `next build` deixou de emitir o aviso de Middleware desativado; a rota `ƒ Proxy
  (Middleware)` não aparece mais na tabela de rotas.
- `tsc --noEmit` limpo e `next build` completo após as duas mudanças, validados nesta
  auditoria.
- A proteção de `/dashboard` continua sendo defesa em profundidade fraca (client-side
  redirect, não gate de servidor), mas isso já era verdade antes — a diferença é que
  agora a documentação não afirma o contrário, e o parâmetro de redirecionamento
  documentado de fato é escrito.
- Nenhum script de deploy (`scripts/deploy-hosting-rest.js`, `scripts/firebase-auth.js`)
  foi alterado; seguem fora do escopo desta correção.
