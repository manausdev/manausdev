# ADR 0012: Remoção do firebase-tools e Atualização de Dependências

**Status:** Aceito  
**Data:** 2026-08-23  
**Autor:** Equipe ManausDev  

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

Além disso, `npm outdated` apontou atualizações menores disponíveis para `next` (16.3.1 → 16.3.2) e `lucide-react` (1.32.0 → 1.33.0).

## Decisão

1. **Remover `firebase-tools` do `package.json`**  
   O pacote não é importado diretamente pelo código-fonte (nenhum `require`/`import` encontrado). O deploy é executado exclusivamente via scripts REST em [`scripts/`](scripts/) que utilizam a Service Account, alinhado ao **ADR 0007**.  
   Remover `firebase-tools` elimina toda a cadeia de dependências vulneráveis (`@opentelemetry/core`, `@google-cloud/pubsub`, `gaxios`, `uuid`).

2. **Atualizar dependências com patch disponível:**
   - `next` de `16.3.1` para `16.3.2`
   - `lucide-react` de `1.32.0` para `1.33.0`

3. **Executar `npm install`** para re-sincronizar o `package-lock.json` e remover os 662 pacotes órfãos deixados por `firebase-tools`.

## Consequências

- `npm audit` passou a reportar **0 vulnerabilidades**.
- Árvore de dependências reduzida de 731 para 69 pacotes.
- O deploy continua funcionando via `npm run deploy` → `node scripts/deploy-hosting-rest.js`, sem necessidade do CLI Firebase.
- Nenhuma mudança breaking no código da aplicação; apenas atualizações de patch/minor no Next.js e lucide-react.
