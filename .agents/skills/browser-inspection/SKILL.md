---
name: browser-inspection
description: >-
  Guia e procedimentos completos para inspecionar, interagir, capturar screenshots
  e validar visualmente aplicações web no navegador real utilizando o browser-mcp-lite.
---

# 🌐 Browser Inspection Skill (browser-mcp-lite)

Controle um Chrome real a partir do agente, via **MCP** ou **CLI**. O servidor
sobe o Chrome headless num perfil temporário, dirige tudo por CDP e encerra o
processo junto com a sessão. **Não há extensão de navegador para instalar.**

Implementação: <https://github.com/lu4nn3ry/browser-mcp-lite> (MIT, zero dependências).

---

## 📡 Arquitetura & Conexão

* **Endpoint MCP HTTP:** `http://127.0.0.1:12307/mcp` (JSON e SSE)
* **Autenticação:** `Authorization: Bearer <token>`
* **Token:** `~/.browser-mcp-secrets.json` ou `~/.browser-mcp-secrets.token`, criado na primeira execução
* **Módulo de token:** `browser-mcp-lite/server/token.js` → `await loadToken()`
* **Bind:** apenas `127.0.0.1`. `GET /health` é aberto e lista as ferramentas sem tocar no navegador.

O Chrome é detectado automaticamente (Chrome, Chromium ou Edge). Para forçar um
binário, defina `BML_CHROME=/caminho/para/chrome`. `BML_HEADFUL=1` mostra a janela.

```bash
node bin/bml.mjs doctor    # Node, Chrome e token
node bin/bml.mjs bridge    # sobe o servidor HTTP
node bin/bml.mjs mcp       # sobe o servidor MCP em stdio
```

---

## 🛠️ Ferramentas Disponíveis (MCP Tools)

`tabId` é uma **string** (o target id do CDP) vinda de `list_tabs`. Quando omitido, a aba ativa é usada.

| Ferramenta | Parâmetros | Descrição |
|---|---|---|
| `list_tabs` | `{}` | Lista as abas abertas com id, título e URL. |
| `open_tab` | `{ url }` | Abre uma nova aba e devolve o outline da página. |
| `navigate_tab` | `{ url, tabId? }` | Navega e espera o `load`. |
| `reload_tab` | `{ tabId?, ignoreCache? }` | Recarrega, opcionalmente ignorando o cache. |
| `focus_tab` | `{ tabId }` | Traz a aba para o primeiro plano. |
| `read_page` | `{ tabId?, maxNodes?, maxDepth?, includeHidden? }` | Outline YAML com `ref=<id>` em cada nó interativo. |
| `click` | `{ target, tabId?, button? }` | Clica por `ref` ou seletor CSS, com eventos de mouse reais. |
| `type_text` | `{ target, text?, tabId?, clear?, submit? }` | Digita com eventos de teclado reais (React e afins registram). |
| `scroll_page` | `{ deltaY?, deltaX?, to?, selector?, tabId? }` | Roda, pula para `top`/`bottom` ou traz um elemento à vista. |
| `screenshot` | `{ tabId?, fullPage?, selector?, format?, quality?, path? }` | PNG/JPEG; `path` grava em disco. |
| `inject_script` | `{ script, args?, tabId? }` | Avalia JS e devolve o resultado em JSON. |
| `audit_page` | `{ tabId?, checks?, selector?, highlight? }` | Overflow horizontal + contraste WCAG AA. |

---

## 🚀 O caminho rápido: CLI

Para capturas e auditorias pontuais, não use JSON-RPC à mão.

```bash
# Screenshot (com o servidor Next já rodando)
node bin/bml.mjs shot http://localhost:3000 screenshot.png --full --width=390

# Tema escuro via media emulation
node bin/bml.mjs shot http://localhost:3000 dark.png --color-scheme=dark

# Auditoria em múltiplas larguras — sai com código 1 se falhar
node bin/bml.mjs audit http://localhost:3000/devs --widths=390,768,1440 --json=report.json
```

`bml audit` imprime uma linha por URL × largura e distingue três situações de
overflow, o que evita falso positivo em carrossel:

* **escapa da viewport** → defeito real, cria scroll horizontal
* **cortado por ancestral** (`overflow-x: hidden|clip`) → conteúdo inalcançável
* **dentro de container com scroll** (`auto|scroll`) → intencional, não é defeito

---

## 📸 Workflow de Inspeção Visual

1. Garanta o dev server no ar e **espere o build terminar**. Uma captura durante
   o compile mostra a tela de erro, não o layout.
2. `node bin/bml.mjs shot <url> <arquivo>.png --width=390` para cada largura que
   importa (390, 768, 1440). Meia largura sozinha esconde o bug clássico.
3. Use a ferramenta de leitura de imagem sobre o PNG para avaliar tipografia,
   espaçamento e alinhamento.
4. Rode `bml audit` para overflow e contraste. Não confie no olho para contraste:
   `#8A93A0` sobre branco dá 3.11:1 e reprova em AA.
5. Para inspecionar algo que só aparece depois de interação, use as ferramentas
   MCP interativas (`read_page` → `click` → `screenshot`) em vez da CLI.

---

## 🔍 Leitura do DOM (`read_page`)

`read_page` devolve um outline compacto em vez de HTML bruto:

```yaml
url: http://localhost:3000/devs
title: "Diretório da Comunidade"
lang: pt-BR
viewport: 390x844

- ref=r1 | role=banner | label="ManausDev"
  - ref=r2 | role=link | label="Devs" | href=/devs
- ref=r3 | role=searchbox | label="Buscar" | placeholder=Nome, skill, bio…
- ref=r4 | role=button | label="Filtrar"
```

* `label` é o nome acessível computado; o que vem depois são os atributos reais.
* Os `ref` são regerados a cada chamada. **Sempre releia após navegar.**
* `click` e `type_text` aceitam `ref` (`"r4"`) ou seletor CSS (`"#busca"`).

---

## 🧭 Boas Práticas ao Testar a UI

1. **Não usar CDN com `eval`.** O projeto usa Tailwind v4 via PostCSS. Play CDN
   quebra CSP e polui o bundle de produção.
2. **Contraste é medido, não estimado.** Tokens como `text-faint` precisam de
   4.5:1 em texto normal e 3:1 em texto grande (≥24px, ou ≥18.66px com peso 700).
3. **Verificar os três estados de overflow** ao mexer em largura: elemento que
   escapa, ancestral com `overflow-x: hidden` que corta, e carrossel com
   `overflow-x: auto` que é intencional.
4. **Aguardar dados dinâmicos.** Screenshot de tela que depende de Supabase ou
   de `localStorage` precisa de espera explícita; sem ela a auditoria mede o
   estado vazio.
5. **Conferir light e dark.** Tokens semânticos devem manter contraste nos dois
   modos; emulação é `--color-scheme=dark`.
