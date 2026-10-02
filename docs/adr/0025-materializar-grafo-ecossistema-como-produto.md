# ADR 0025: Materializar o grafo do ecossistema como produto

**Status:** Aceito
**Data:** 2026-10-02
**Autor:** Equipe ManausDev

## Contexto

As FKs do schema já existem (`projects.author_id`, `events.organizer_id`, `jobs.posted_by`, `companies.created_by`). O grafo existe no banco e não existe no produto. A pergunta deixa de ser "quem é desenvolvedor?" e passa a ser "como o ecossistema tecnológico de Manaus está conectado?".

ADR 0021, Fase 4 exige ADR próprio antes de executar.

## Decisão

Materializar arestas como produto navegável:

- Páginas de relações por entidade: quem participa de X, quem mantém Y, quem organiza Z.
- Visualização do grafo do ecossistema (SVG/CSS nativo, zero deps).
- Localização geográfica como camada posterior.

### Escopo inicial

- Rota `/ecossistema` com visualização estática do grafo usando SVG nativo.
- Nós: Person, Empresa, Projeto, Evento, Comunidade, Vaga.
- Arestas: trabalha em, mantém, participa de, vai a, contribui, possui skill, posta vaga.
- Dados mock para demonstração; integração com Supabase via `createPublicClient` quando disponível.

### Restrições

- Zero deps: sem biblioteca de grafo. SVG + CSS Modules.
- Não inventar conteúdo em produção: usar mock quando `useMockData()` ativo, caso contrário renderizar estado vazio.

## Consequências

Positivas:
- Diferencial competitivo difícil de replicar.
- Navegação por conexões aumenta descoberta.

Negativas:
- Complexidade de layout manual em SVG.
- Manutenção de posições de nós.

Riscos:
- Performance com muitos nós; mitigar com paginação/limite inicial.
