# ADR 0006: Deploy como site estático com build opcional e servidor de desenvolvimento

**Status:** Aceito  
**Data:** 2026-08-13  
**Autor:** Equipe ManausDev  

## Contexto

Precisamos de uma forma simples de rodar o projeto localmente e fazer deploy sem complexidade de infraestrutura.

## Decisão

Usar **deploy como site estático** com:

- `serve.js` para desenvolvimento local (HTTP server simples em Node.js)
- `build.js` para build de produção (concatena e minifica CSS/JS, otimiza HTML)
- Output em `dist/` para deploy em qualquer CDN/SSG (Netlify, Vercel, GitHub Pages, S3)
- `package.json` com scripts `dev`, `build`, `serve`

NÃO usar Docker, CI/CD complexo ou plataforma de deploy proprietária no MVP.

## Consequências

### Positivas
- Deploy trivial: basta subir arquivos estáticos
- Custo zero ou mínimo na maioria dos hosts
- `serve.js` funciona sem instalação de ferramentas extras
- `build.js` é simples e transparente

### Negativas
- Sem hot reload nativo (necessita reload manual)
- Sem suporte a rotas dinâmicas complexas
- Build manual não otimiza assets (imagens, fonts)

## Alternativas consideradas

1. **Vite + vanilla**: Melhor DX, mas exije dependência e configuração. Melhor para pós-MVP.
2. **Docker**: Overkill para site estático. Descartado.
3. **Next.js / Nuxt**: Adicionam SSR/SSG, mas também complexidade. Melhor para pós-MVP.

## Referências

- `serve.js` - Servidor de desenvolvimento
- `build.js` - Script de build
- `package.json` - Scripts de automação
- `TODO.md` - Seção "34. Infraestrutura"
