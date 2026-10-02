# ADR 0026: Reputação, badges e moderação — Fase 5 do Community OS

**Status:** Proposto
**Data:** 2026-10-02
**Autor:** Equipe ManausDev
**Relacionado:** ADR 0021 (Community OS), Issue #49

## Contexto

A Fase 5 do roadmap Community OS (ADR 0021) exige um domínio `contributions` (reputação, badges) e um domínio `moderation` (aprovação, denúncias, verificação). Hoje não há como distinguir membro ativo de cadastro inativo; a prova social é gap competitivo apontado na análise.

O grafo materializado (Fase 4) fornece lastro real: eventos atendidos, projetos publicados, contribuições open-source. A reputação deve ser derivada de contribuição real, com critérios públicos, estilo Hashnode.

## Decisão

### 1. Domínios

```
src/domains/
  contributions/
    model.ts          # tipos Badge, ReputationEvent, ReputationScore
    repository.ts     # acesso a Supabase via infrastructure
    service.ts        # cálculo de reputação, concessão de badges
    schemas.ts        # validação Zod-like manual (zero deps)
    queries.ts        # listagens públicas
    mutations.ts      # registrar evento de contribuição
  moderation/
    model.ts          # tipos Report, Review, Verification
    repository.ts
    service.ts        # workflow aprovação/denúncia/verificação
    schemas.ts
    queries.ts
    mutations.ts
```

Regras:
- Domínio não importa `@supabase/ssr`; usa `infrastructure/supabase/repositories`.
- Critérios de badge são públicos e versionados em `contributions/badges.ts`.
- Reputação é soma ponderada de eventos verificados, não pontuação arbitrária.
- Moderação é separada de autorização RLS; `profile_type` continua discriminador de permissão.

### 2. Schema

Novas tabelas (migração `20261002000000_contributions_moderation.sql`):

- `badges(id, slug, name, description, criteria_json, icon, created_at)`
- `user_badges(user_id, badge_id, awarded_at, evidence_json, unique(user_id,badge_id))`
- `reputation_events(id, user_id, type, source_table, source_id, points, metadata, created_at)`
- `reports(id, reporter_id, target_type, target_id, reason, status, reviewed_by, reviewed_at, created_at)`
- `verifications(id, user_id, type, status, evidence_url, reviewed_by, reviewed_at, created_at)`

RLS:
- Leitura pública para badges e user_badges.
- Escrita de reputation_events via trigger a partir de eventos reais (projeto criado, evento participado).
- Reports: inserção pública, leitura/edição apenas admin.
- Verifications: leitura do próprio usuário + admin.

### 3. Critérios públicos de badges

Exemplos iniciais:
- `first_project` — publicou primeiro projeto.
- `event_attendee` — participou de 3 eventos.
- `open_source_contributor` — projeto com link GitHub e ≥1 star (verificado via metadata).
- `community_builder` — criou comunidade com ≥50 membros.

Critério é JSON público: `{ "type": "count", "source": "projects", "min": 1 }`.

### 4. Workflow de moderação

- Aprovação: conteúdo criado por novos usuários entra como `pending` e requer revisão admin.
- Denúncia: `reports` com status `open` → `reviewed` → `resolved`/`dismissed`.
- Verificação: solicitação de verificação de perfil/empresa com evidência; admin aprova.

### 5. O que não faremos

- Pontuação sem lastro (rejeitado no ADR 0021).
- Badges ocultos ou critérios secretos.
- Moderação automatizada por IA (fase futura).

## Consequências

Positivas:
- Prova social distinguível; gamificação leve com lastro.
- Domínios isolados, testáveis, prontos para extração incremental.

Negativas:
- Migração de schema com RLS adicional.
- Cálculo de reputação precisa ser idempotente.

Riscos:
- Inflação de badges se critérios forem muito fáceis — mitigado por revisão de critérios públicos.
- Performance de agregação — índices em `user_id`, `type`, `created_at`.

## Próximos passos

- Criar migração Supabase e atualizar `types/database.ts`.
- Implementar `contributions` e `moderation` com testes Vitest.
- Expor badges no perfil público `/devs/[username]`.
