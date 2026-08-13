# ManausDev — Design System

Documento de referência visual para toda a plataforma ManausDev.

---

## 1. Visão geral

A identidade visual da ManausDev é baseada em um tema escuro moderno, com acentos em ciano/verde amazônico, tipografia limpa e efeitos sutis de vidro (glassmorphism). O objetivo é transmitir tecnologia, inovação e conexão com a região amazônica.

## 2. Paleta de cores

### Cores principais
- **background**: `#121222`
- **surface**: `#121222`
- **surface-container-lowest**: `#0c0c1d`
- **surface-container-low**: `#1a1a2b`
- **surface-container**: `#1e1e2f`
- **surface-container-high**: `#29283a`
- **surface-container-highest**: `#333345`
- **surface-variant**: `#333345`
- **surface-bright**: `#38374a`
- **primary**: `#e9feff`
- **primary-fixed**: `#63f7ff`
- **primary-fixed-dim**: `#00dce5`
- **primary-container**: `#00f5ff`
- **on-primary**: `#003739`
- **on-primary-container**: `#006c71`
- **on-primary-fixed**: `#002021`
- **on-primary-fixed-variant**: `#004f53`
- **secondary**: `#b7c4ff`
- **secondary-container**: `#033bba`
- **on-secondary**: `#002682`
- **on-secondary-container**: `#a4b5ff`
- **on-secondary-fixed**: `#001452`
- **on-secondary-fixed-variant**: `#0038b6`
- **secondary-fixed**: `#dde1ff`
- **secondary-fixed-dim**: `#b7c4ff`
- **tertiary**: `#fff8fb`
- **tertiary-container**: `#f2d3ff`
- **tertiary-fixed**: `#f4d9ff`
- **tertiary-fixed-dim**: `#e5b5ff`
- **on-tertiary**: `#4e0078`
- **on-tertiary-container**: `#9700e1`
- **on-tertiary-fixed**: `#30004b`
- **on-tertiary-fixed-variant**: `#7000a8`
- **text-primary**: `#e3e0f8`
- **text-secondary**: `#849495`
- **inverse-surface**: `#e3e0f8`
- **inverse-primary**: `#00696e`
- **inverse-on-surface**: `#2f2f40`
- **outline**: `#849495`
- **outline-variant**: `#3a494a`
- **border-low-opacity**: `rgba(48, 86, 211, 0.2)`
- **error**: `#ffb4ab`
- **error-container**: `#93000a`
- **on-error**: `#690005`
- **on-error-container**: `#ffdad6`
- **surface-tint**: `#00dce5`
- **cobalt-elevated**: `#1b1b3a`
- **cobalt-surface**: `#12122b`

## 3. Tipografia

### Fontes
- **Display / Hero / Headlines**: Montserrat (700, 800)
- **Body / UI / Labels**: Inter (400, 600)
- **Code**: JetBrains Mono (400)

### Escala tipográfica
- **display-hero**: 48px / line-height 1.1 / letter-spacing -0.03em / weight 800
- **display-hero-mobile**: 32px / line-height 1.1 / letter-spacing -0.02em / weight 800
- **headline-section**: 32px / line-height 1.2 / weight 700
- **headline-card**: 20px / line-height 1.3 / weight 600
- **body-base**: 16px / line-height 1.6 / weight 400
- **body-sm**: 14px / line-height 1.5 / weight 400
- **label-caps**: 11px / line-height 1.0 / letter-spacing 0.1em / weight 700
- **code-snippet**: 14px / line-height 1.6 / weight 400

## 4. Espaçamento

- **unit**: 4px
- **gutter-mobile**: 16px
- **gutter-desktop**: 24px
- **margin-mobile**: 20px
- **margin-desktop**: 48px
- **section-gap**: 80px

## 5. Border radius

- **DEFAULT**: 0.125rem (2px)
- **lg**: 0.25rem (4px)
- **xl**: 0.5rem (8px)
- **full**: 0.75rem (12px)

## 6. Componentes

### 6.1 Glass card
Efeito de vidro com backdrop blur. Usado em cards principais.

```css
.glass-card {
    background: rgba(26, 26, 43, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(132, 148, 149, 0.3);
}
```

### 6.2 Botões
- **Primário**: `bg-primary-container text-on-primary-container`
- **Secundário**: `bg-surface-container text-on-surface border border-outline-variant/30`
- **Hover**: `hover:border-primary-container hover:text-primary-container`
- **Tamanhos**: `px-5 py-2 rounded-full` (filters), `px-6 py-3` (CTAs)

### 6.3 Badges / Tags
- **Categoria**: `px-2 py-1 bg-surface-container text-on-surface-variant text-xs rounded-md font-code-snippet`
- **Featured**: `absolute top-4 right-4 bg-surface/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-container`

### 6.4 Grid
- **Bento grid**: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter-desktop`
- **Featured card**: `md:col-span-2` para cards em destaque

### 6.5 Sidebar (desktop)
- **Largura**: `w-64` fixa
- **Background**: `bg-surface-container-low`
- **Borda direita**: `border-r border-outline-variant/30`
- **Links**: `flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-xl`
- **Link ativo**: `bg-primary-container text-on-primary-container rounded-xl`

### 6.6 Navegação mobile
- Sidebar oculta em mobile: `hidden lg:flex`
- Main content ocupa tela cheia: `flex-1 lg:ml-64`

## 7. Layouts por página

### 7.1 Homepage / Project Showcase
- Sidebar fixa à esquerda (desktop)
- Header com título grande + descrição
- Filtros horizontais com pills
- Grid bento de projetos
- Card featured com layout horizontal (`sm:flex-row`)
- Cards normais com layout vertical
- Footer com botão "Load More"

### 7.2 Diretórios (Devs, Projetos, Empresas, Vagas, Eventos, Comunidades)
- Navbar superior sticky
- Filtros em linha
- Grid de cards 3 colunas (desktop)
- Paginação centralizada

### 7.3 Dashboard
- Sidebar + conteúdo principal
- Cards de estatísticas em grid
- Seções alternáveis (overview, perfil, projetos, configurações)

## 8. Ícones

- **Biblioteca**: Material Symbols Outlined
- **Peso/Fill**: `wght,FILL@100..700,0..1`
- **Uso**: `<span class="material-symbols-outlined">nome_do_icone</span>`
- **Exemplos**: `groups`, `article`, `terminal`, `settings`, `public`, `smartphone`, `psychology`, `videogame_asset`, `star`, `fork_right`, `open_in_new`, `arrow_forward`, `expand_more`

## 9. Tema

- **Padrão**: Dark mode (`class="dark"` no `<html>`)
- **Suporte a claro**: Cores invertidas usando `inverse-*` quando necessário
- **Transições**: `transition-all duration-300` em cards e botões
- **Hover states**: `hover:-translate-y-1 hover:shadow-md` em cards

## 10. Responsividade

- **Mobile first**: breakpoints `md:` (768px) e `lg:` (1024px)
- **Sidebar**: oculta em mobile, fixa em desktop
- **Grid**: 1 coluna (mobile) → 2 colunas (tablet) → 3 colunas (desktop)
- **Cards featured**: `md:col-span-2` em tablets/desktops
- **Padding**: `px-margin-mobile` (mobile) → `md:px-margin-desktop` (desktop)

## 11. Assets e imagens

- **Placeholder**: Imagens de projeto via `lh3.googleusercontent.com/aida-public/...`
- **Avatares**: `https://i.pravatar.cc/150?u=...`
- **Logos padrão**: `https://ui-avatars.com/api/?name=...&background=047857&color=fff&size=128`

## 12. Referências

- `index.html` — Homepage / Project Showcase
- `pages/projetos/index.html` — Diretório de projetos
- `pages/devs/index.html` — Diretório de desenvolvedores
- `TODO.md` — Roadmap do projeto
