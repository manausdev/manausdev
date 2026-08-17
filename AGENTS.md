# 🤖 AGENTS.md — Instruções para Agentes de IA

Este documento contém diretrizes arquiteturais e regras estritas para qualquer Agente de IA que trabalhar neste repositório.

---

## ⚠️ REGRA CRÍTICA: NÃO APAGUE OS SCRIPTS EM `scripts/`

> **IMPORTANTE:** Os scripts localizados na pasta `scripts/` foram criados para comunicação via **REST API** com os serviços do Firebase/Google Cloud utilizando as credenciais de Service Account (`*admin.json` / `*firebase-adminsdk*.json`).
>
> **Eles serão a base para a criação de uma ferramenta CLI (`appcli`) no futuro.**  
> **NÃO APAGUE, NÃO REMOVA E NÃO SUBSTITUA ESSES SCRIPTS POR DEPENDÊNCIAS DE LOGIN INTERATIVO.**

---

## 📁 Estrutura dos Scripts Salvos (`scripts/`)

| Arquivo | Descrição |
|---|---|
| [`scripts/firebase-auth.js`](file:///C:/Users/luann/Documents/GitHub/manausdev/scripts/firebase-auth.js) | Gerador de Access Token OAuth2 via JWT assinado com a Service Account (`*admin.json`). Sem dependência de login no browser. |
| [`scripts/deploy-hosting-rest.js`](file:///C:/Users/luann/Documents/GitHub/manausdev/scripts/deploy-hosting-rest.js) | Deploy automatizado no **Firebase Hosting** consumindo diretamente a Firebase Hosting REST API v1beta1. |
| [`scripts/firestore-rest.js`](file:///C:/Users/luann/Documents/GitHub/manausdev/scripts/firestore-rest.js) | Cliente REST para operações de banco de dados no **Firestore** com a chave admin. |

---

## 🚀 Como Executar o Deploy via REST

Para rodar o build e publicar no Firebase Hosting usando a REST API:

```bash
npm run deploy
# ou diretamente:
node build.js
node scripts/deploy-hosting-rest.js
```

---

## 🔒 Segurança de Credenciais

* O arquivo de credenciais da conta de serviço (`*admin.json` ou `*firebase-adminsdk*.json`) contém chaves privadas e **NUNCA** deve ser adicionado ao build público (`dist/`) ou enviado para o repositório Git público.
* Os scripts em `scripts/` são executados apenas no ambiente Node.js / CLI.

---

## 🛠️ Futuro: Implementação do `appcli`

No roadmap futuro, estes scripts serão empacotados e expandidos em uma ferramenta CLI completa (`appcli`):
* Comandos planejados:
  * `appcli deploy` — Build e deploy no hosting via REST.
  * `appcli db:sync` — Sincronização e backup de dados Firestore via REST.
  * `appcli db:seed` — Carga inicial de dados mock no Firestore.
  * `appcli dev` — Servidor de desenvolvimento com integração REST.
