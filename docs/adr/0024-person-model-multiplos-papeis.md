# ADR 0024 — Evoluir `profiles` para modelo Person com papéis múltiplos

## Status
Proposto

## Contexto
O modelo atual `profiles` amarra identidade a um único `profile_type` (`dev`/`empresa`/`admin`) e a um cargo textual `role`. Uma pessoa real acumula papéis — developer, founder, researcher, project maintainer, community member, event organizer — e o schema não representa isso, travando o grafo e empobrecendo o perfil público.

ADR 0021, Fase 3, define a evolução para Person com papéis declarativos com escopo, skills/experiences como tabelas, "membro desde" e prova social no card.

`profile_type` permanece exclusivamente como discriminador de autorização RLS (ADR 0016).

## Decisão
Adotar modelo Person com papéis declarativos com escopo, mantendo `profile_type` para RLS.

### Schema alvo (incremental)
- `profiles` permanece como identidade base; `role` vira cargo textual opcional.
- Nova tabela `person_roles`:
  - `id uuid pk`
  - `person_id uuid references profiles(id) on delete cascade`
  - `role_type text` (ex: `developer`, `founder`, `maintainer`, `organizer`, `member`)
  - `scope_type text` (ex: `project`, `event`, `community`, `company`)
  - `scope_id uuid` (referência polimórfica via FKs condicionais ou tabela de escopo)
  - `since timestamptz`
  - `created_at timestamptz`
- `person_skills` e `person_experiences` como tabelas normalizadas (Fase 3).
- Índices para consultas de grafo.

RLS acompanha: leitura pública para papéis declarativos; escrita restrita ao próprio usuário ou admin.

### UI
Perfil exibe:
- Papéis acumulados com escopo (ex: "Mantenedor de Projeto X", "Organizador de Evento Y")
- Prova social: N projetos · M eventos · Membro desde
- Skills normalizadas

## Consequências
- Positivas: grafo local materializado; perfil representa pessoa inteira; diferenciação por papéis.
- Negativas: migração de schema; rework de RLS; duas arquiteturas coexistem durante transição.
- Riscos: confusão entre `profile_type` (autorização) e papéis (declaração) — mitigada por nomenclatura e documentação.

## Alternativas
- Manter `profiles` como está — não representa pessoa inteira.
- Multi-conta por papel — fricção de UX.

## Referências
Issue #42
ADR 0021, seção 3
ADR 0016
