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

## 🚫 REGRA CRÍTICA: ZERO DEPENDÊNCIAS

> **O projeto é `zero deps`.** Nenhuma biblioteca de terceiros é permitida em
> `dependencies` nem em `devDependencies`, com exceção de `next`, `react` e
> `react-dom`.
>
> **NÃO ADICIONE NOVAS DEPENDÊNCIAS** sem aprovação explícita do responsável pelo
> repositório. Isso vale para libraries, frameworks e ferramentas de build.

### O que isso proíbe

| Categoria | Proibido | Motivo |
|---|---|---|
| CSS utilitário | Tailwind, UnoCSS, Windi | A regra é remover o Tailwind (ver migração abaixo) |
| CSS-in-JS | styled-components, Emotion, vanilla-extract | Todos exigem runtime ou plugin de build |
| Runtime de UI | Radix, shadcn, Chakra, MUI, Headless UI | Cada um traz dozens de pacotes transitivos |
| Helpers de classe | `clsx`, `tailwind-merge` | São ~15 linhas; reimplementar localmente |
| Qualquer outra |lodash, date-fns, zod, axios… | Resolver no idioma ou no módulo local |

### O que é permitido

* **CSS Modules** — recurso nativo do Next.js, zero dependência.
* **CSS puro** em `globals.css` e em `*.module.css`.
* **Custom properties** (`--token`) para os design tokens.
* **`next/font`** para tipografia.
* APIs nativas da plataforma (fetch, Intl, Web APIs).

### Como estilizar

O padrão do projeto é **CSS Modules por componente**, com os tokens consumidos
via `var(--token)`. Exemplo de um componente do design system:

```
src/atoms/Button/
├── Button.tsx          → importa styles from './Button.module.css'
├── Button.module.css    → .base, .primary, .secondary, .focusRing
├── Button.test.tsx
└── index.ts
```

**Não escreva utilitários no JSX.** Nada de `className="flex items-center gap-2
text-xs"`. A composição acontece dentro do CSS do componente. O único lugar
aceitável para utilitários soltos é o layout de uma página, e mesmo assim
preferindo um `Page.module.css`.

### Helper de classe

`cn()` em `src/lib/utils.ts` usa `clsx` + `tailwind-merge`, que serão removidos
com o Tailwind. Substitua por uma implementação local que apenas concatena
strings e descarta valores falsy:

```ts
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
```

Sem semântica de conflito de classe: o CSS Module passa a ser a única fonte de
verdade de quais regras vencem.

---

## 🎨 Migração: remoção do Tailwind (em andamento)

O Tailwind está sendo removido do projeto. Status atual:

| Item | Quantidade | Status |
|---|---|---|
| Ocorrências de `className` | 989 em 48 arquivos | ⬜ Pendente |
| Classes utilitárias distintas | 448 | ⬜ Pendente |
| Componentes do design system usando tokens do Tailwind | 11 (atoms + molecules) | ⬜ Pendente |
| `tailwind.config.ts` | — | ⬜ Remover no final |
| `postcss.config.mjs` | — | ⬜ Remover no final |

**Ordem de migração obrigatória** — do mais estável ao mais volátil:

1. `@theme inline` em `globals.css` para custom properties puras (sem Tailwind).
2. `src/lib/utils.ts`: remover `clsx` e `tailwind-merge`.
3. Atoms e molecules: trocar classes utilitárias por CSS Modules.
4. Organisms e templates.
5. Páginas, uma de cada vez.
6. Remover `tailwindcss`, `@tailwindcss/postcss`, `autoprefixer`, `postcss`,
   `tailwind-merge` e `clsx` do `package.json`.

**Validação obrigatória por página:** `npm run build`, `npm test` e a auditoria de
contraste antes de considerar a página migrada:

```bash
node C:\Users\luann\.copilot\repos\browser-mcp-lite\bin\bml.mjs audit http://localhost:3000/<rota> --widths=390,768,1440
```

> **Não remova uma regra de `globals.css` enquanto `rg "<classe>" src` ainda
> encontrar uso.** A auditoria de contraste é o que garante que a remoção de
> `.chip-*` e `.manaus-*` não introduziu texto abaixo de 4.5:1.

---

## 🛠️ Futuro: Implementação do `appcli`

No roadmap futuro, estes scripts serão empacotados e expandidos em uma ferramenta CLI completa (`appcli`):
* Comandos planejados:
  * `appcli deploy` — Build e deploy no hosting via REST.
  * `appcli db:sync` — Sincronização e backup de dados Firestore via REST.
  * `appcli db:seed` — Carga inicial de dados mock no Firestore.
  * `appcli dev` — Servidor de desenvolvimento com integração REST.
