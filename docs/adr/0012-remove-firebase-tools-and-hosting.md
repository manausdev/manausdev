# ADR 0012: Remoção do Firebase Tools e Firebase Hosting

**Status:** Aceito  
**Data:** 2026-08-23  
**Autor:** Equipe ManausDev  
**Atualizado:** 2026-09-29 (Remoção do Firebase Hosting)

## Contexto

O comando `npm audit` identificou **5 vulnerabilidades de severidade moderada** no projeto, concentradas em:

- `@opentelemetry/core` (< 2.8.0) — unbounded memory allocation em W3C Baggage propagation
- `uuid` (< 11.1.1) — missing buffer bounds check em v3/v5/v6

Essas vulnerabilidades foram herdadas transitivamente através da cadeia:

```
firebase-tools >=13.14.0
  → @google-cloud/pubsub
    → @opentelemetry/core
  → gaxios
    → uuid
```

Além disso, o projeto migrou o hosting de Firebase para Vercel, tornando o Firebase Hosting obsoleto.

## Decisão

1. **Remover `firebase-tools` do `package.json`**  
   O pacote não é importado diretamente pelo código-fonte (nenhum `require`/`import` encontrado).  
   Remover `firebase-tools` elimina toda a cadeia de dependências vulneráveis (`@opentelemetry/core`, `@google-cloud/pubsub`, `gaxios`, `uuid`).

2. **Remover Firebase Hosting do projeto**  
   - Remover `firebase.json` (configuração de hosting)
   - Remover `scripts/deploy-hosting-rest.js` (script de deploy via REST API)
   - Remover script `deploy` do `package.json`
   - Atualizar documentação para refletir o uso de Vercel como plataforma de hosting

3. **Manter scripts REST para autenticação e Firestore**  
   Os scripts `firebase-auth.js` e `firestore-rest.js` são mantidos conforme **ADR 0007** para uso futuro em ferramenta CLI (`appcli`).

4. **Atualizar dependências com patch disponível:**
   - `next` de `16.3.1` para `16.3.2`
   - `lucide-react` de `1.32.0` para `1.33.0`

5. **Executar `npm install`** para re-sincronizar o `package-lock.json` e remover os pacotes órfãos deixados por `firebase-tools`.

## Consequências

- `npm audit` passou a reportar **0 vulnerabilidades**.
- Árvore de dependências reduzida significativamente.
- O deploy agora é feito via Vercel CLI ou integração Git.
- Scripts REST para autenticação e Firestore são mantidos para uso futuro em `appcli`.
- Nenhuma mudança breaking no código da aplicação; apenas atualizações de patch/minor no Next.js e lucide-react.
