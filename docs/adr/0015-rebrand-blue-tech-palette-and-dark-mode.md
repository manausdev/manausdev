# ADR 0015: Rebrand para a paleta Blue-Tech com modo claro/escuro

**Status:** Aceito  
**Data:** 2026-09-29  
**Autor:** Equipe ManausDev  

## Contexto

A identidade visual "Green-Tech" (ADR 0009) baseada em tons de verde (`#003527`, `#006c49`, `#6cf8bb`) divergia do logo oficial da ManausDev, cujo gradiente é azul → ciano → verde. Cores hardcoded espalhadas por 25+ arquivos dificultavam manutenção e não havia suporte a modo escuro. A paleta oficial foi extraída programaticamente da imagem de design da marca.

## Decisão

1. **Paleta oficial Blue-Tech:**
   - **Azul primário (`#0073FD`):** Ações primárias, links e accent (`--accent`).
   - **Azul do logo (`#009BFD`):** Início do gradiente da marca (`--brand-blue`).
   - **Ciano (`#02B8B5`):** Meio do gradiente e detalhes técnicos (`--cyan`).
   - **Verde neon (`#4BD76D`):** Fim do gradiente e destaques positivos (`--neon`).
   - **Ink (`#191918`):** Tipografia de alto contraste (`--ink`).

2. **Sistema de tokens CSS semânticos:**
   - Substituição de ~260 ocorrências de hex hardcoded por classes utilitárias semânticas (`bg-surface`, `text-ink`, `text-accent-text`, `btn-primary`, `chip-leaf`, etc.).
   - Tokens de superfície (`--canvas`, `--surface-1/2/3`), tipografia (`--ink/--body/--muted/--faint`), marca (`--accent`, `--brand-blue`, `--cyan`, `--neon`) e status (`--success`, `--danger`) definidos em `src/app/globals.css` e expostos ao Tailwind v4 via `@theme inline`.

3. **Modo claro/escuro:**
   - Variant `@custom-variant dark (&:where(.dark, .dark *))` do Tailwind v4 com classe `.dark` no `<html>`.
   - Componente `ThemeToggle` (`src/components/theme-toggle.tsx`) com persistência em `localStorage` (chave `manausdev-theme`) e fallback para `prefers-color-scheme`.
   - Script inline `themeInitScript` no `layout.tsx` para evitar FOUC.

4. **Gradiente da marca como utility:**
   - `bg-gradient-brand`: `linear-gradient(135deg, #009bfd 0%, #02b8b5 50%, #4bd76d 100%)` — usado no logo da navbar, avatares e destaques.

5. **Assets atualizados:**
   - Badges "Feito em Manaus" (SVG claro/escuro e PNG @2x) regenerados com o gradiente da marca.

## Consequências

### Positivas
- Identidade visual 100% alinhada ao logo oficial.
- Modo escuro nativo com transição sem flash.
- Manutenção centralizada: trocar a paleta exige editar apenas os tokens em `globals.css`.
- Contraste e acessibilidade preservados nos dois temas.

### Negativas
- ADR 0009 e `DESIGN.md` anteriores ficam obsoletos (este ADR os substitui).
- Dependência do Tailwind v4 (`@theme inline`, `@custom-variant`, `@utility`) — não portável para v3 sem adaptação.

## Referências

- [`DESIGN.md`](../../DESIGN.md)
- [`src/app/globals.css`](../../src/app/globals.css)
- [`src/components/theme-toggle.tsx`](../../src/components/theme-toggle.tsx)
- [`src/app/layout.tsx`](../../src/app/layout.tsx)
- [ADR 0009 — Design System Green-Tech (substituído)](0009-corporate-modern-green-tech-design-system.md)
