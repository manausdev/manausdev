# ADR 0010: Exibição de Visual Previews na Galeria e Vitrine de Projetos

**Status:** Aceito  
**Data:** 2026-08-19  
**Autor:** Equipe ManausDev  

## Contexto

A página de projetos ([`src/app/projetos/page.tsx`](../../src/app/projetos/page.tsx)) exibia apenas informações textuais (título, descrição, stack e links). Para aumentar o engajamento, a atratividade visual e demonstrar o nível técnico e de acabamento dos projetos criados no ecossistema do Amazonas, foi identificada a necessidade de apresentar um preview visual/screenshot de cada projeto, bem como um fallback bio-orgânico consistente com a identidade visual da plataforma.

## Decisão

1. **Header Visual nos Cards de Projetos:**
   - Adicionada área superior de preview com altura definida (`h-44`) e proporção otimizada para screenshots e mockups de interface.
   - Efeito sutil de zoom (`group-hover:scale-105`) e transição suave na imagem ao passar o mouse.
   - Badge flutuante `🌿 Manaus Tech` destacando a origem regional do projeto sobre a imagem.

2. **Fallback Visual Bio-Orgânico:**
   - Para projetos sem `image_url` cadastrada, renderização automática de um background em gradiente temático verde-floresta (`#003527` -> `#002219`), padrão vetorial `bio-texture` em marca d'água e ícone técnico estilizado.

3. **Ações e Links:**
   - Link de demonstração atualizado para `Ver Preview` / `Demo Online`, apontando para a aplicação em produção.
   - Link direto ao repositório GitHub com ícone dedicado.

4. **Extensão no Dashboard de Usuários:**
   - Adicionado campo `URL da Imagem / Screenshot (Preview)` no modal de cadastro de novos projetos em [`src/app/dashboard/page.tsx`](../../src/app/dashboard/page.tsx), gravando a propriedade `image_url` na tabela `projects` do Supabase.

## Consequências

### Positivas
- Vitrine de projetos com alto apelo visual corporativo e moderno ("Green-Tech").
- Melhora significativa no tempo de permanência e exploração de projetos da comunidade.
- Flexibilidade com suporte tanto a imagens externas (CDNs, Unsplash, Supabase Storage) quanto a fallbacks sem quebra de layout.

### Negativas
- Necessidade de orientar a comunidade a cadastrar imagens de preview em formato horizontal com proporção adequada (ex: 16:9 ou 4:3).

## Referências

- [`src/app/projetos/page.tsx`](../../src/app/projetos/page.tsx)
- [`src/app/dashboard/page.tsx`](../../src/app/dashboard/page.tsx)
- [`src/lib/data/mock-data.ts`](../../src/lib/data/mock-data.ts)
- [`docs/adr/0009-corporate-modern-green-tech-design-system.md`](./0009-corporate-modern-green-tech-design-system.md)
