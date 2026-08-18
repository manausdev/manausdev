# 🌿 ManausDev — Design System (KISS)

> **Identidade Visual Cyber-Amazônica**: A fusão entre o ecossistema tecnológico contemporâneo e a alma de Manaus — dos rios caudalosos à densa floresta tropical.

---

## 1. Conceito & Identidade Regional

O design system da **ManausDev** segue o princípio **KISS (*Keep It Simple, Stupid*)**: direto ao ponto, sem dezenas de tokens redundantes ou frameworks inchados. Toda a interface é orientada a **Dark-First**, inspirada na estética **Cyber-Amazônica**:

- 🌊 **Rio Negro:** Fundos escuros profundos e reflexivos como as águas escuras do Rio Negro.
- ⚡ **Cyber Ciano (Igapó Tech):** Luzes de néon representando inovação, tecnologia e circuitos digitais.
- 🍃 **Verde Vitória-Régia / Floresta:** O frescor e vitalidade da biodiversidade amazônica.
- ☀️ **Solimões & Encontro das Águas:** Tons quentes e terrosos representando o encontro de ideias e calor humano.
- 🌸 **Boto Rosa:** Acentos vibrantes para ações críticas e identidade cultural.
- 🌌 **Açaí / Noite Ribeirinha:** Índigo suave para elementos secundários e transições.

---

## 2. Paleta de Cores Regionalizada

Uma paleta compacta, semântica e diretamente espelhada no arquivo [`css/variables.css`](file:///C:/Users/luann/Documents/GitHub/manausdev/css/variables.css).

### 2.1 Cores Base & Acentos Regionais

| Token CSS | Hex | Referência Regional | Uso Principal |
|---|---|---|---|
| `--bg-main` | `#070A12` | **Rio Negro Profundo** | Fundo geral da aplicação (Dark-first) |
| `--bg-surface` | `#0E1424` | **Igarapé Noturno** | Superfícies elevadas e cabeçalhos |
| `--primary` | `#00F5FF` | **Cyber Ciano / Águas Claras** | Ações principais, foco, links ativos e glow |
| `--emerald` | `#10B981` | **Verde Floresta / Vitória-Régia** | Sucesso, badges ecológicos, selo "Feito em Manaus" |
| `--amber` | `#F59E0B` | **Solimões Dourado / Sol Poente** | Avisos, estrelas de destaque e tags quentes |
| `--rose` | `#F43F5E` | **Boto-Cor-de-Rosa** | Erros, ações destrutivas e alertas críticos |
| `--secondary` | `#818CF8` | **Açaí & Crepúsculo** | Acentos secundários, tags neutras e bordas |

### 2.2 Textos & Contrastes (Bruma Amazônica)

| Token CSS | Hex | Finalidade |
|---|---|---|
| `--text-main` | `#F8FAFC` | Texto principal, títulos e alto contraste |
| `--text-secondary` | `#94A3B8` | Textos secundários, legendas e descrições |
| `--text-muted` | `#64748B` | Placeholders, datas e informações secundárias |

### 2.3 Superfícies & Vidro (Manaus Glass)

```css
/* Tokens de Vidro e Bordas */
--bg-card: rgba(15, 23, 42, 0.75);         /* Fundo translúcido com tom azulado */
--bg-card-hover: rgba(22, 33, 62, 0.85);   /* Destaque no hover */
--bg-input: rgba(11, 17, 33, 0.8);          /* Fundo para formulários */
--border-subtle: rgba(255, 255, 255, 0.08); /* Linhas divisórias leves */
--border-card: rgba(255, 255, 255, 0.12);   /* Contorno sutil dos cards */
--border-focus: #00F5FF;                    /* Foco acessível */
```

---

## 3. Tipografia Essencial

Apenas 3 famílias tipográficas com propósitos claros e objetivos:

| Família | Fonte | Pesos | Onde Usar |
|---|---|---|---|
| **Display** | `Montserrat` | 700, 800, 900 | Hero, títulos de destaque (H1-H3), logos e números de métricas |
| **Body** | `Inter` | 400, 500, 600 | Textos corridos, parágrafos, inputs, botões e labels |
| **Code** | `JetBrains Mono` | 400, 500 | Trechos de código, atalhos (`Ctrl+K`), badges técnicos e tags |

### Escala de Tamanhos Simples

- **Hero Title:** `clamp(2rem, 5vw, 3.25rem)` (Montserrat 900 / line-height 1.1)
- **Section Heading (H2):** `1.75rem` (Montserrat 800 / line-height 1.2)
- **Card Title (H3):** `1.25rem` (Montserrat 700 / line-height 1.3)
- **Body Normal:** `15px` / `0.9375rem` (Inter 400-500 / line-height 1.6)
- **Body Small / Captions:** `13px` / `0.8125rem` (Inter 500)
- **Badges / Monospace:** `11px` - `12px` (JetBrains Mono 500)

---

## 4. Espaçamento & Raios (Grid 4px)

- **Unidade Base:** `4px`
- **Espaçamentos Práticos:** `8px` (2), `12px` (3), `16px` (4), `24px` (6), `32px` (8), `48px` (12), `64px` (16)
- **Raios de Borda (`border-radius`):**
  - `--radius-sm`: `6px` (tags, atalhos)
  - `--radius-md`: `10px` (inputs, botões padrão)
  - `--radius-lg`: `14px` (modais compactos)
  - `--radius-xl`: `20px` (cards principais)
  - `--radius-full`: `9999px` (pills, filtros, avatares)

---

## 5. Componentes Principais (KISS)

### 5.1 Card "Manaus Glass"
O cartão principal translúcido com reflexo de água e glow no hover:

```css
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card:hover {
  border-color: rgba(0, 245, 255, 0.4);
  box-shadow: 0 0 25px -4px rgba(0, 245, 255, 0.35);
  transform: translateY(-3px);
}
```

### 5.2 Botões
- **Primário (Cyber Ciano):** `.btn-primary` → Fundo `#00F5FF`, texto escuro `#00282B`, glow suave.
- **Secundário / Ghost:** `.btn-ghost` → Fundo transparente, borda sutil, hover com fundo branco translúcido.
- **Destaque Regional (Floresta):** `.btn-emerald` → Fundo `#10B981`, texto branco, para ações comunitárias e ambientais.

### 5.3 Badges & Tags Regionais
- **Feito em Manaus:** Badge oficial verde esmeralda com grafismo de folha/seiva ([`BADGE.md`](file:///C:/Users/luann/Documents/GitHub/manausdev/BADGE.md)).
- **Tag Tech:** Fundo `rgba(0, 245, 255, 0.1)`, texto `#00F5FF`, fonte JetBrains Mono.
- **Status Ativo / Comunidade:** Fundo `rgba(16, 185, 129, 0.12)`, texto `#10B981`.
- **Destaque Solimões:** Fundo `rgba(245, 158, 11, 0.12)`, texto `#F59E0B`.

### 5.4 Inputs & Formulários
- Fundo escuro `rgba(11, 17, 33, 0.8)` com borda sutil.
- Ao focar: Borda `#00F5FF` e anel de foco `rgba(0, 245, 255, 0.2)`.

---

## 6. Diretrizes & Regras de Design (KISS)

1. **Dark-First:** O Rio Negro é o padrão. Todas as interfaces devem priorizar o fundo escuro com alto contraste.
2. **KISS (Simplicidade Suprema):** Use classes utilitárias e variáveis semânticas diretas do CSS (`--primary`, `--emerald`, `--bg-card`), evitando abstrações complexas e tokens fantasmas.
3. **Identidade Local Orgânica:** Utilize as cores regionais com propósito (Verde para comunidade/projetos, Âmbar para eventos/destaques, Ciano para tech e código).
4. **Performance & Vanilla:** Animações baseadas em `transform` e `opacity` aceleradas por hardware (tempo padrão `150ms` a `250ms`).
5. **Acessibilidade (WCAG AA):** Todo texto sobre fundo escuro deve manter contraste mínimo de 4.5:1.
