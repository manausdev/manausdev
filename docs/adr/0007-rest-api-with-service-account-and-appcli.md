# ADR 0007: Automação via REST API com Service Account (*admin.json) e base para appcli

**Status:** Aceito  
**Data:** 2026-08-17  
**Autor:** Equipe ManausDev  
**Atualizado:** 2026-09-29 (Remoção do Firebase Hosting)

## Contexto

A utilização do Firebase CLI tradicional para operações em banco de dados depende de autenticação interativa no navegador (`firebase login`), o que causa falhas frequentes em ambientes automatizados (CI/CD, terminais headless, contêineres e agentes de IA autônomos).

Além disso, o projeto necessita de uma fundação sólida para automação de tarefas administrativas e futuras integrações, que serão consolidadas em uma ferramenta CLI dedicada (`appcli`).

O projeto migrou o hosting de Firebase para Vercel, eliminando a necessidade de deploy via Firebase Hosting REST API.

## Decisão

1. **Uso de REST APIs com Service Account (`*admin.json`):**
   - Utilizar a conta de serviço do Google Cloud / Firebase para gerar tokens OAuth2 (JWT Bearer) via código Node.js nativo (`scripts/firebase-auth.js`), eliminando a necessidade de login interativo.
   - Fornecer cliente REST para manipulação e sincronização de dados no **Firestore** (`scripts/firestore-rest.js`).

2. **Preservação dos scripts para o `appcli`:**
   - Manter os scripts REST na pasta `scripts/` como módulos reutilizáveis.
   - Registrar no arquivo `AGENTS.md` a proibição expressa de exclusão ou substituição desses scripts por comandos interativos.
   - Esses scripts servirão de base para empacotar o utilitário CLI `appcli` (`appcli db:sync`, `appcli db:seed`, `appcli dev`).

3. **Segurança de credenciais:**
   - Adicionar padrões estritos de exclusão no `.gitignore` (`*admin.json`, `*firebase-adminsdk*.json`, logs de debug) para garantir que chaves privadas nunca sejam incluídas em builds públicos ou enviadas ao Git.

## Consequências

### Positivas
- Operações de banco de dados 100% autônomas e sem intervenção humana no browser.
- Menor dependência de binários pesados de CLI global.
- Base padronizada e modular para o desenvolvimento do `appcli`.
- Rastreamento seguro com `.gitignore` blindado para credenciais de serviço.
- Simplificação do processo de deploy via Vercel.

### Negativas
- Necessidade de manter scripts de integração REST quando houver alterações nas APIs públicas do Google Cloud.
- Responsabilidade aumentada na gestão local do arquivo de credenciais da Service Account.

## Alternativas consideradas

1. **Firebase CLI interativo:** Requer login manual via browser, inviável para automação headless e agentes.
2. **Firebase Admin SDK (npm package):** Funciona bem para backend, mas o uso de REST puro com JWT dispensa dependências pesadas e permite integração direta com endpoints HTTP.

## Referências

- [`AGENTS.md`](../../AGENTS.md) - Diretrizes para agentes e roadmap do `appcli`
- [`scripts/firebase-auth.js`](../../scripts/firebase-auth.js) - Gerador de token OAuth2 JWT
- [`scripts/firestore-rest.js`](../../scripts/firestore-rest.js) - Cliente REST do Firestore
