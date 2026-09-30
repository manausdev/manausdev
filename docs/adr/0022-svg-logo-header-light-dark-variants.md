# ADR 0020: SVG Logo no Header com variante clara (Pantone 2026 C)

**Status:** Aceito  
**Data:** 2026-09-30  
**Autor:** Mike Medeiros (@UmTalDeMike)

## Contexto

O Header exibia um placeholder de texto `</>` dentro de um `<div>` com gradiente
CSS como logotipo. Ele não correspondia à identidade visual da marca e não tinha
relação com o favicon criado no [ADR 0019](0019-favicon-from-brand-symbol.md).

Além disso, o placeholder era adequado apenas para o tema escuro (fundo gradiente
azul-ciano). No tema claro o contraste entre o fundo gradiente e a superfície do
Header era insuficiente para distinguir o ícone.

## Decisão

### 1. SVG inline como componente `LogoIcon`

O logo é implementado como SVG inline via o componente `LogoIcon` em
`src/components/icons.tsx`. Isso:

- mantém a regra de **zero dependências** — sem `next/image`, sem pacote externo;
- é acessível via `role="img"` e `aria-label`;
- fica totalmente sob controle de versão como código, sem assets binários adicionais
  no bundle do navegador.

O design replica o favicon: fundo arredondado (`rx="8"`) → diamante rotacionado
(gradiente `#009BFD → #02B8B5 → #4BD76D`) → `</>` recortado como stroke com a cor
do fundo.

### 2. Três variantes: `dark`, `light` e `auto`

| Variante | Fundo | Uso recomendado |
|---|---|---|
| `dark`  | `#0c1f2e` — azul naval | Superfícies escuras, hero sections |
| `light` | `#F5F0E8` — Pantone 2026 C (branco quente) | Superfícies claras, prints, og-image |
| `auto`  | Alterna via CSS | **Header** — segue o tema ativo sem re-render JS |

A variante `auto` renderiza dois `<g>` no mesmo SVG. A alternância é feita via CSS
puro em `globals.css`:

```css
.logo-layer-dark  { display: none; }
.logo-layer-light { display: block; }

.dark .logo-layer-dark  { display: block; }
.dark .logo-layer-light { display: none; }
```

Isso garante que a troca de tema (`ThemeToggle` adiciona/remove `.dark` no `<html>`)
atualize o logo instantaneamente sem hidratação ou `useEffect`.

### 3. Arquivos SVG estáticos para uso externo

Dois SVGs estáticos são mantidos em `public/assets/` para uso em contextos fora
do React (og-image, README, apresentações):

- `public/assets/logo-manausdev.svg` — variante escura
- `public/assets/logo-manausdev-light.svg` — variante clara (Pantone 2026 C)

### 4. Remoção do `.logoText` e simplificação do `.logo` no CSS Module

O `Header.module.css` deixa de definir gradiente, tamanho fixo e cor no `.logo`.
A classe vira apenas um wrapper de posicionamento com `border-radius` e hover
suave, pois o SVG já carrega toda a sua própria estética:

```css
.logo {
  display: block;
  flex-shrink: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: opacity 180ms ease, transform 180ms ease;
}
```

## Alternativas consideradas

**`next/image` com o PNG `icone-manausdev.png`** — descartado porque o PNG tem
apenas 60 × 60 px (seria borrado em telas Retina) e `next/image` adiciona
complexidade para um asset de UI sem benefício de lazy loading.

**SVG externo via `<img src="/assets/logo-manausdev.svg">`** — descartado porque
não permite troca de variante via CSS sem JS adicional.

**`prefers-color-scheme` media query dentro do SVG** — descartado porque o projeto
controla o tema via classe `.dark` (opt-in manual, `ThemeToggle`), não via media
query do sistema operacional.

## Verificação

- `npm run build` passa sem erros de tipo ou de lint.
- `npm test` — todos os testes existentes passam.
- Inspeção visual: tema claro → logo com fundo Pantone 2026 C; tema escuro → logo
  com fundo azul naval. A troca é instantânea ao clicar em `ThemeToggle`.

## Consequências

- **Positivas:** identidade visual consistente entre favicon e Header; sem assets
  extras no bundle; troca de tema sem flash.
- **Negativas:** o SVG inline duplica as duas camadas no DOM. O custo é ~600 bytes
  gzip — negligenciável.
- **Próximos passos:** usar `variant="light"` na og-image e no og-card quando esses
  componentes forem criados.

## Referências

- [ADR 0019: Favicon a partir do símbolo da marca](0019-favicon-from-brand-symbol.md)
- [ADR 0015: Rebrand para a paleta Blue-Tech](0015-rebrand-blue-tech-palette-and-dark-mode.md)
- [ADR 0017: Migração para CSS Modules](0017-css-modules-migration-icons-and-audit-findings.md)
- Pantone 2026 C: `#F5F0E8` (branco quente / off-white)
