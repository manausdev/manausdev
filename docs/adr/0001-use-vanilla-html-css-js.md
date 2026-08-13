# ADR 0001: Usar HTML/CSS/JS vanilla como stack inicial do MVP

**Status:** Aceito  
**Data:** 2026-08-13  
**Autor:** Equipe ManausDev  

## Contexto

Precisamos lançar o MVP da ManausDev rapidamente, com baixa complexidade de deploy e sem dependência de frameworks ou build steps pesados. A equipe é pequena e quer focar em produto, não em tooling.

## Decisão

Adotar **HTML + CSS + JavaScript vanilla** como stack inicial do frontend, com:

- **CSS modular**: `variables.css`, `global.css`, `components.css`, `responsive.css`
- **JavaScript modular**: ES6 modules (`import`/`export`) sem bundler
- **Dados mock via localStorage**: `api.js` como camada de abstração sobre `localStorage`
- **Design system próprio**: variáveis CSS para tema claro/escuro, componentes reutilizáveis
- **Build opcional**: `build.js` para minificar CSS/JS e gerar `dist/`
- **Servidor estático**: `serve.js` para desenvolvimento local

NÃO usar frameworks como React, Vue, Angular ou bundlers como Vite/Webpack no MVP.

## Consequências

### Positivas
- Deploy trivial: basta hospedar arquivos estáticos em qualquer CDN/SSG
- Curva de aprendizado zero para contribuidores que sabem HTML/CSS/JS básico
- Performance excelente sem overhead de framework
- Código legível e editável sem ferramentas complexas
- Baixa manutenção: sem dependências externas, sem `node_modules`
- Fácil migração futura: o design system em CSS variables pode ser reaproveitado

### Negativas
- Sem componentes reutilizáveis via framework: repetição de HTML entre páginas
- Sem hot reload nativo: usar `serve.js` com reload manual ou `build.js --watch`
- Sem state management robusto: gerenciamento manual de estado global
- Menor produtividade a longo prazo para UIs complexas
- Dificuldade de escalar sem um framework em páginas com muita interatividade

## Alternativas consideradas

1. **React + Vite**: Mais produtivo, mas adiciona complexidade de build, deploy e onboarding. Descartado para MVP.
2. **Next.js**: Ótimo para SEO e deploy, mas overkill para um MVP sem backend real. Descartado.
3. **Vue 3**: Mais simples que React, mas ainda assim adiciona dependência e curva de aprendizado. Descartado para MVP.
4. **Astro**: Perfeito para conteúdo estático, mas ainda é uma ferramenta nova com menos documentação. Pode ser adotado no pós-MVP.

## Referências

- `TODO.md` - Seção "3. Arquitetura / Frontend"
- `css/variables.css` - Design system
- `js/api.js` - Camada de abstração de dados
- `build.js` - Script de build
- `serve.js` - Servidor estático
