# 🌊 ManausDev — Design System (Blue-Tech)

> **Identidade Visual Blue-Tech:** Gradiente azul → ciano → verde inspirado no logo oficial — unindo tecnologia, os rios da Amazônia e a energia da comunidade. Sistema baseado em tokens CSS com suporte nativo a **modo claro e escuro**.

---

## 1. Cores e Tokens Semânticos

### Paleta da marca

| Cor | Hex | Uso |
|---|---|---|
| **Azul primário** | `#0073FD` | Botões, links, ações primárias (`--accent`) |
| **Azul do logo** | `#009BFD` | Início do gradiente da marca (`--brand-blue`) |
| **Ciano** | `#02B8B5` | Meio do gradiente, detalhes técnicos (`--cyan`) |
| **Verde neon** | `#4BD76D` | Fim do gradiente, destaques positivos (`--neon`) |
| **Ink** | `#191918` | Texto de alto contraste (`--ink`) |
| **Branco** | `#FFFFFF` | Fundo principal no modo claro (`--canvas`) |

### Tokens de superfície (modo claro)

| Token | Hex | Descrição |
|---|---|---|
| `--canvas` | `#ffffff` | Fundo principal da aplicação |
| `--surface` | `#ffffff` | Superfície de cards e navbar |
| `--surface-1` | `#f5f8fc` | Fundos de agrupamento sutis |
| `--surface-2` | `#ebf1f9` | Fundos secundários |
| `--surface-3` | `#dde5ef` | Bordas fortes e estados elevados |
| `--border` | `#e3e9f1` | Bordas padrão |
| `--border-strong` | `#c6d2e0` | Bordas em hover/foco |

### Tokens de tipografia

| Token | Hex (claro) | Descrição |
|---|---|---|
| `--ink` | `#191918` | Títulos e texto de alto contraste |
| `--body` | `#3c4249` | Corpo de texto |
| `--muted` | `#667080` | Textos secundários |
| `--faint` | `#8a93a0` | Placeholders e texto terciário |

### Tokens de marca e status

| Token | Hex (claro) | Descrição |
|---|---|---|
| `--accent` | `#0073fd` | Ações primárias |
| `--accent-hover` | `#005fcc` | Hover do accent |
| `--accent-text` | `#0073fd` | Links e texto accent |
| `--accent-soft` | `#e6f0ff` | Fundo tint do accent |
| `--brand-blue` | `#009bfd` | Azul do gradiente do logo |
| `--cyan` | `#02b8b5` | Ciano do gradiente |
| `--neon` | `#4bd76d` | Verde neon (badges, botões leaf) |
| `--deep` / `--deep-2` | `#0c2233` / `#071624` | Superfícies sempre-escuras (hero, overlays) |
| `--success` | `#16794a` | Estados de sucesso |
| `--danger` | `#d92d20` | Estados de erro |

### Modo escuro

Todos os tokens acima são redefinidos no seletor `.dark` (classe aplicada no `<html>`). Exemplos: `--canvas: #0a0d12`, `--ink: #f2f5f8`, `--accent-text: #74b7ff`. A alternância é feita pelo componente `ThemeToggle` (`src/components/theme-toggle.tsx`) com persistência em `localStorage` (chave `manausdev-theme`) e fallback para `prefers-color-scheme`. O script inline `themeInitScript` no `layout.tsx` evita flash de tema incorreto (FOUC).

---

## 2. Gradiente da marca

```css
/* bg-gradient-brand (utility Tailwind) */
linear-gradient(135deg, #009bfd 0%, #02b8b5 50%, #4bd76d 100%);
```

Usado no logo da navbar, avatares e destaques. Versão suave: `bg-gradient-brand-soft` (12% de opacidade).

---

## 3. Tipografia

- **Display & Títulos:** `Sora` (700 / 800) — via `--font-display`.
- **Corpo & UI:** `Inter` (400 / 500 / 600) — via `--font-body`.
- **Mono:** `JetBrains Mono` — via `--font-mono-theme`.

---

## 4. Componentes CSS

Definidos em `src/app/globals.css`:

| Classe | Descrição |
|---|---|
| `.manaus-card` | Card com hover elevado e borda transitiva |
| `.glass-card` | Card translúcido com backdrop-blur |
| `.bio-texture` | Textura diagonal sutil em azul (5% opacidade) |
| `.btn-primary` / `.btn-secondary` / `.btn-leaf` | Botões do sistema |
| `.chip-leaf` / `.chip-river` | Chips e tags |
| `.manaus-input` | Inputs com foco accent |

---

## 5. Elevação e Formas

- **Raios:** Botões/inputs `4px` (0.25rem) · Cards `12px` (0.75rem) · Badges/pills `full`.
- **Sombras:** `--shadow-card-ambient`, `--shadow-card-hover`, `--shadow-elevated`, `--shadow-glow-accent` — todas baseadas em azul `rgba(0, 115, 253, …)`.
- **Motion:** Transições `180–250ms` com curva `cubic-bezier(0.16, 1, 0.3, 1)`; `prefers-reduced-motion` respeitado.
