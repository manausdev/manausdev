# ADR 0017: Migração para CSS Modules — ícones com `size`, chip de disponibilidade único e limites da auditoria

**Status:** Aceito (migração em andamento)
**Data:** 2026-09-29
**Autor:** Equipe ManausDev

## Contexto

O `AGENTS.md` exige remover o Tailwind e manter o projeto com zero dependências, usando
CSS Modules por componente. A migração estava avançada, mas uma varredura antes de remover
`@theme inline` encontrou dependências ocultas do Tailwind que **não gerariam erro de build**
e quebrariam a interface em silêncio:

1. **Ícones.** `src/components/icons.tsx` usava `className = 'w-4 h-4'` como padrão nos 46
   ícones, e 45 usos em 11 arquivos passavam `w-*`/`h-*`. Sem o Tailwind, todo SVG perderia
   o tamanho.
2. **Disponibilidade dos devs.** `AvailabilityMeta` devolvia strings de classe
   (`bg-accent`, `chip-leaf !text-[11px] ...`). A listagem de devs e o perfil dependiam
   delas, embora a molécula `AvailabilityChip` (CSS Module) já existisse sem uso nas páginas.
3. **CSS inválido herdado da migração.** `empresas/[id]/detail.module.css` tinha
   `max-width: 4xl;`, token do Tailwind que o navegador ignora, deixando o contêiner sem
   largura máxima.
4. **Bug de layout na home.** `.statsBar` (`position: absolute; bottom: 0; translateY(50%)`)
   estava dentro de `.heroContent`, também `position: relative`. O contêiner de referência
   era o conteúdo, não o hero, e a barra cobria os botões de CTA.
5. **Contraste.** `text-slate-400` no `auth/callback` dava cerca de 2,6:1 sobre fundo claro.

## Decisão

### Ícones: prop `size` com CSS Module

`icons.tsx` passa a aceitar `size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'`,
mapeado em `icons.module.css` (padrão `sm` = 1rem). Os usos deixam de passar `w-*`/`h-*`.
Cor e opacidade vão para o CSS Module da página, via `className`.

| Antes | Depois |
|---|---|
| `w-3 h-3` | `size="xxs"` |
| `w-3.5 h-3.5` | `size="xs"` |
| `w-4 h-4` | padrão (`sm`) |
| `w-5 h-5` | `size="md"` |
| `w-6 h-6` | `size="lg"` |
| `w-10 h-10` | `size="xl"` |
| `w-16 h-16` | `size="xxl"` |

### Disponibilidade: um único componente

Listagem e perfil de devs usam `AvailabilityChip`. `className` e `dot` foram removidos de
`AvailabilityMeta`, que passa a carregar só o `label`.

**Mudança de comportamento:** a listagem usava `open` como fallback quando o dev não tinha
disponibilidade, e o próprio `AvailabilityChip` documenta isso como bug. O fallback agora é
`busy` (conservador) nos dois lugares, como o perfil já fazia.

### Páginas migradas

Detalhe de comunidades, detalhe de eventos, perfil de dev e `auth/callback` ganharam
módulos próprios (`detail.module.css`, `dev-profile.module.css`, `callback.module.css`),
sem depender de `manaus-card`, `btn-*` nem `bg-gradient-brand`. Para as tags de skill e
stack usei classes locais em vez de sobrescrever o átomo `Chip`: um override dependeria da
ordem das folhas de estilo, o risco que o `AGENTS.md` descreve para o `tailwind-merge`.

### Correções de layout

- `max-width: 56rem` no detalhe de empresas.
- Card de vaga em `empresas/[id]` empilha abaixo de 640px.
- `.statsBar` movida para filho direto de `section.hero`, com `.statsGrid` limitado a
  `calc(80rem - 4rem)` para alinhar com `.heroContent`.
- `text-slate-400` substituído por `var(--muted)`.

## Limites da auditoria (`bml audit`)

A ferramenta `browser-mcp-lite` (clonada como pasta irmã do repositório, conforme o import
de `scripts/check-browser.js`) foi usada nas 21 rotas em 390, 768 e 1440 px. O que aprendemos:

- **Ela não enxerga imagem, gradiente nem fundo translúcido** (`color-mix` com alpha,
  `backdrop-filter`). Nesses casos assume fundo branco e reporta falsos positivos, como
  título branco sobre foto ou o logo do cabeçalho. O contrário também vale: um par
  aprovado pode ser ilegível de fato.
- **`--color-scheme` não altera o tema do app**, que ignora `prefers-color-scheme`. A
  rodada "dark" não testa o modo escuro real.
- **Overflow horizontal é confiável** e pegou o card de vaga cortado no mobile.

Regra adotada: um alerta de contraste sobre fundo não sólido só se encerra com **captura de
tela** (`bml shot`), e a ausência de alerta não substitui a inspeção visual desses casos.

Os dados de demonstração para a auditoria local exigem `NEXT_PUBLIC_USE_MOCK=true`, que
nunca deve ser habilitado em produção (`src/lib/env.ts`).

## Consequências

- **Positivas:** ícones, chips e páginas migradas deixam de depender do Tailwind;
  bugs de layout que passavam em build e testes foram corrigidos; há um critério
  explícito de como usar a auditoria.
- **Negativas:** `size` é um vocabulário novo a manter em `icons.module.css`; a listagem
  de devs mostra "Ocupado" para perfis sem disponibilidade, o que muda o que
  visitantes veem.
- **Pendente antes de remover o Tailwind:**
  - classes globais legadas `manaus-card`, `manaus-input`, `chip-river` e `btn-*` em
    `devs`, `empresas`, `eventos`, `projetos`, `vagas` e `Card.tsx`;
  - 7 arquivos `*.stories.tsx` com utilitários;
  - `cn()` ainda usa `clsx` + `tailwind-merge`;
  - remoção de `@theme inline`, `postcss.config.mjs`, `tailwind.config.ts` e devDeps,
    nessa ordem, conforme o `AGENTS.md`.
- O caminho do `bml.mjs` no `AGENTS.md` (`C:\Users\luann\...`) não existe em outras máquinas
  e deve ser atualizado.
