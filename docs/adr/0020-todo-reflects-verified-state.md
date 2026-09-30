# ADR 0020: TODO.md reflete o estado verificado do código

**Status:** Aceito
**Data:** 2026-09-30
**Autor:** Mike Medeiros (@UmTalDeMike)

## Contexto

O `TODO.md` é o roadmap público do projeto (seção 36, "Roadmap público"), mas tinha
quase todos os itens das seções 1 a 41 marcados como `[x]`, inclusive funcionalidades
que não existem no código. Exemplos conferidos na `main` em `e4b070d`:

- rotas `/equipes`, `/conteudo`, `/projetos/novo`, painel admin e busca global não existem;
- login com Google, recuperação de senha, exclusão de conta e exportação de dados não existem;
- as tabelas `skills`, `articles`, `likes`, `bookmarks`, `reports` e `team_requests` não
  existem em `supabase/schema.sql`;
- não há `sitemap`, `robots`, imagem Open Graph, CSP, analytics nem testes E2E;
- o site não tem tela para cadastrar vagas, eventos, empresas, comunidades ou notícias,
  embora o RLS já permita o insert para os tipos de perfil certos.

Além disso, a seção 3 e a seção "MVP — IMPLEMENTADO" descreviam a estrutura em HTML/CSS/JS
puro, substituída pelo Next.js no [ADR 0008](0008-migrate-to-nextjs-and-supabase.md), e o
arquivo começava com uma frase que não fazia parte do roadmap ("Para o repositório ...,
eu faria o `TODO.md` ...").

Um roadmap que marca como pronto o que não existe impede que contribuidores achem trabalho
e esconde lacunas de segurança e LGPD (spam no formulário de contato, ausência de exclusão
e exportação de dados).

## Decisão

### Checkbox só com evidência

O `TODO.md` passa a seguir uma regra explícita, escrita no topo do arquivo:

- `[x]` somente quando o item existe no código, no banco (`supabase/schema.sql`) ou nas
  configurações do GitHub;
- `[ ]` quando não existe ou quando não há evidência no repositório. Itens de operação
  (backup, monitoramento, divulgação) podem existir fora do repositório e devem ser
  remarcados por quem tiver a evidência;
- *parcial:* com nota curta dizendo o que existe e o que falta.

### Estrutura preservada

As 41 seções e o texto dos itens foram mantidos, para que a comparação com a versão
anterior seja direta. As mudanças foram:

- checkboxes revistos item a item, com a evidência em nota curta quando útil;
- seção 3 e seção 4 atualizadas para a stack real (Next.js, Supabase, Vercel);
- seção "MVP — IMPLEMENTADO" substituída por "MVP — estado em 2026-09-30", separando o
  que funciona do que ainda falta;
- frase solta do início do arquivo removida.

## Verificação

Cada item foi conferido por busca no código da `main` (`e4b070d`):

- rotas em `src/app/`, tabelas e policies em `supabase/schema.sql` e `supabase/migrations/`;
- escritas no banco pelo site: só `profiles`, `projects`, `contacts` e a troca de
  `profile_type` por administradores;
- configurações do GitHub pela API: organização sem site nem membros públicos, repositório
  só com labels padrão, Discussions ativo, branch protection ativa na `main`.

"Não existe" significa que a busca não encontrou rota, tabela ou chamada correspondente.
As telas não foram testadas uma a uma com o site rodando.

## Consequências

- **Positivas:** o roadmap volta a servir para escolher trabalho; as lacunas de segurança,
  LGPD e SEO ficam visíveis; itens `[ ]` podem virar issues com `good first issue`.
- **Negativas:** o arquivo mostra bem menos itens concluídos do que antes, o que muda a
  percepção de progresso do projeto.
- **Manutenção:** todo PR que entregar um item do roadmap deve marcar o checkbox no mesmo
  PR, com a evidência.

## Referências

- [ADR 0008: Migração para Next.js e Supabase](0008-migrate-to-nextjs-and-supabase.md)
- [ADR 0014: Correção de RCE crítico e remoção de Middleware morto](0014-fix-critical-nextjs-rce-and-remove-dead-middleware.md)
- [ADR 0016: Tipos de perfil e matriz de permissões](0016-profile-types-and-permission-matrix.md)
