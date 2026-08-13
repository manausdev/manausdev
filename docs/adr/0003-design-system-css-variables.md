# ADR 0003: Design system baseado em CSS variables com suporte a tema claro/escuro

**Status:** Aceito  
**Data:** 2026-08-13  
**Autor:** Equipe ManausDev  

## Contexto

Precisamos de uma identidade visual consistente em todas as páginas, com suporte a modo escuro e fácil customização. Não queremos usar bibliotecas externas de CSS.

## Decisão

Criar **design system próprio** usando:

- `css/variables.css` com variáveis CSS para cores, tipografia, espaçamento, sombras, breakpoints
- Suporte nativo a `prefers-color-scheme: dark` e `prefers-reduced-motion: reduce`
- Componentes reutilizáveis em `css/components.css`: `.btn`, `.card`, `.input`, `.navbar`, `.footer`, `.badge`, `.tabs`, `.modal`, `.grid`
- Mobile-first com media queries em `css/responsive.css`

NÃO usar Bootstrap, Tailwind, Material UI ou outras bibliotecas CSS.

## Consequências

### Positivas
- Zero dependências externas
- Controle total sobre o design
- Tema escuro nativo sem JavaScript
- Fácil manter e evoluir
- Arquivos pequenos e específicos

### Negativas
- Menos componentes prontos que bibliotecas populares
- Responsabilidade de manter acessibilidade manualmente
- Sem utilitários avançados como `flex`, `grid` helpers

## Alternativas consideradas

1. **Tailwind CSS**: Muito popular, mas exije build step e configuração. Melhor para pós-MVP.
2. **Bootstrap**: Pesado e com design genérico. Descartado.
3. **Plain CSS sem variáveis**: Mais simples, mas difícil manter consistência e tema escuro.

## Referências

- `css/variables.css` - Variáveis do design system
- `css/components.css` - Componentes reutilizáveis
- `css/responsive.css` - Media queries
- `TODO.md` - Seção "2. Identidade visual"
