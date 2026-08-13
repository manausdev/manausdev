# ADR 0002: Usar localStorage como banco de dados inicial (mock)

**Status:** Aceito  
**Data:** 2026-08-13  
**Autor:** Equipe ManausDev  

## Contexto

Precisamos de uma camada de dados para o MVP que não exija backend, deploy de banco ou configuração de ambiente. Queremos que a aplicação rode como site estático puro.

## Decisão

Usar **localStorage** como banco de dados inicial, com:

- `js/api.js` como camada de abstração genérica (`getAll`, `getById`, `create`, `update`, `delete`, `search`)
- Dados mock pré-populados via `js/seed.js` (21 devs, 12 projetos, etc.)
- Estrutura de entidades compatível com futura migração para Supabase/PostgreSQL

NÃO usar backend real, Supabase ou banco de dados externo no MVP.

## Consequências

### Positivas
- Zero configuração: funciona abrindo o `index.html` no browser
- Dados persistem entre sessões no mesmo browser
- Código da API é agnóstico ao backend: basta trocar a implementação de `loadData`/`saveData`
- Fácil testar e depurar
- Baixíssimo custo de infraestrutura

### Negativas
- Dados não sincronizam entre devices/browsers
- Limite de ~5MB por origem
- Sem concorrência/controle de acesso real
- Dados expostos no cliente: não armazenar secrets
- Performance degrada com muitos registros

## Alternativas consideradas

1. **Supabase**: Excelente para produção, mas exije conta, projeto configurado e deploy. Melhor para pós-MVP.
2. **Firebase**: Similar ao Supabase, mas com vendor lock-in maior. Descartado.
3. **IndexedDB**: Mais robusto que localStorage, mas API mais complexa. Descartado para MVP.
4. **Arquivos JSON estáticos**: Simples, mas sem capacidade de escrita/edição pelos usuários.

## Referências

- `js/api.js` - Cliente de API com localStorage
- `js/seed.js` - Dados iniciais
- `TODO.md` - Seção "4. Backend" e "5. Banco de dados"
