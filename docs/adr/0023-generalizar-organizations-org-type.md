# ADR 0023 — Generalizar Organizations com org_type

## Status
Proposto

## Contexto
O ecossistema Manaus/Amazonas possui universidades, laboratórios, ONGs, coletivos e órgãos públicos que não se encaixam em `companies` nem `communities`. O schema atual limita o mapeamento real do ecossistema.

## Decisão
Adotar estratégia incremental: adicionar `org_type` à tabela `companies` como passo inicial, mantendo rotas existentes e evitando quebra.

Tipos suportados:
- `company`
- `university`
- `research`
- `government`
- `nonprofit`
- `collective`
- `community` (mapeado via view futura)

`companies.org_type` será `text` com check constraint e default `company`. Comunidades permanecem em tabela própria por enquanto; unificação completa será avaliada em ADR futuro.

## Consequências
- Schema alterado com migração.
- RLS mantido.
- UI de empresas passa a exibir facetas por tipo.
- Facilita descoberta por tipo de organização.
- Próximo passo: view `organizations` unificando `companies` + `communities`.

## Alternativas
- Unificação total imediata em tabela `organizations` — maior impacto, quebra de rotas.
- Manter separado — não resolve o problema.

## Referências
Issue #45
