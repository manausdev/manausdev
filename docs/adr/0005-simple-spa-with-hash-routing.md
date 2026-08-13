# ADR 0005: SPA simples com roteamento por hash e carregamento dinâmico de páginas

**Status:** Aceito  
**Data:** 2026-08-13  
**Autor:** Equipe ManausDev  

## Contexto

Queremos uma experiência de navegação fluida sem recarregar a página, mas sem a complexidade de um framework SPA ou servidor com SSR.

## Decisão

Usar **SPA simples** com:

- Roteamento por hash (`#home`, `#projects`, `#devs`) em `js/app.js`
- Cada página como HTML separado carregado pelo browser
- JavaScript modular por página (`pages/*/main.js`)
- Estado global simples via `store` em `js/app.js`

NÃO usar React Router, Vue Router ou Next.js App Router.

## Consequências

### Positivas
- URLs compartilháveis funcionam sem servidor especial
- Funciona em hosting estático puro
- Fácil entender e debugar
- Cada página é um arquivo HTML independente

### Negativas
- URLs com `#` são menos elegantes que URLs limpas
- Sem SSR/SSG: SEO depende de meta tags estáticas
- Estado não compartilhado entre páginas sem localStorage

## Alternativas consideradas

1. **React + React Router**: Mais poderoso, mas exije build e framework. Melhor para pós-MVP.
2. **MPA tradicional (server-rendered)**: Mais simples, mas exije backend. Descartado.
3. **Astro com View Transitions**: Moderno, mas ainda em evolução. Pode ser adotado depois.

## Referências

- `js/app.js` - Router e estado global
- `index.html` - Homepage com navegação hash
- `TODO.md` - Seção "3. Arquitetura / Frontend"
