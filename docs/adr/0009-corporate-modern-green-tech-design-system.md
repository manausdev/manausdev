# ADR 0009: Adoção do Design System Green-Tech (Corporate Modern & Bio-Organic)

**Status:** Aceito  
**Data:** 2026-08-18  
**Autor:** Equipe ManausDev  

## Contexto

A plataforma ManausDev necessitava de uma identidade visual madura, sofisticada e alinhada à sua proposta de valor regional: conectar profissionais de alto nível, startups de bioeconomia, empresas do Polo Industrial e iniciativas open-source no Amazonas. A estética anterior foi substituída por um design system corporativo moderno com toques bio-orgânicos ("Green-Tech").

## Decisão

1. **Paleta Semântica Green-Tech:**
   - **Floor & Superfícies:** `#f7f9fb` como base clara de alta legibilidade, com superfícies de cards em `#ffffff`.
   - **Deep Amazon Green (`#003527`):** Cor primária de autoridade, utilizada na marca, tipografia de títulos e botões principais de ação.
   - **Vibrant Leaf Green (`#006c49`):** Cor secundária para status ativo/disponibilidade, badges de habilidades (`chip-leaf`) e botões de destaque.
   - **River Blue (`#00314a`):** Cor terciária para categorização técnica, vínculos com mercado/vagas e badges institucionais (`chip-river`).

2. **Tipografia Dupla Estratégica:**
   - **Sora (`var(--font-sora)`):** Headings e display com caráter geométrico e tech-forward.
   - **Inter (`var(--font-inter)`):** Textos corridos, dados e rótulos de interface para máxima legibilidade.

3. **Elevação e Texturas Bio-Orgânicas:**
   - **Cards Elevados:** Sombras ambientais suaves com matiz verde amazônico (`0 4px 20px rgba(6, 78, 59, 0.05)`).
   - **Bordas Superiores Temáticas:** Identificação visual de seções (4px em Deep Amazon Green, Leaf Green ou River Blue).
   - **Bio-Texture:** Padrão sutil vetorial geométrico com 3% de opacidade para enriquecer planos de fundo sem comprometer o contraste.
   - **Floating Stats & Bento Grid:** Apresentação de dados-chave e vitrine de projetos regionais em módulos de alta densidade visual.

4. **Componentes Táteis:**
   - Botões com microinterações e sombras projetadas.
   - Inputs com anéis de foco em verde vibrante (`#006c49`).

## Consequências

### Positivas
- Identidade visual profissional, consistente e com personalidade regional sem clichês tropicais.
- Alto contraste e acessibilidade aprimorada (WCAG) com fundo claro e tipografia nítida.
- Componentes modulares e reutilizáveis via Tailwind CSS e classes utilitárias.

### Negativas
- Necessidade de manter a consistência de novos componentes criados com a paleta semântica estipulada no `DESIGN.md`.

## Referências

- [`DESIGN.md`](../../DESIGN.md)
- [`tailwind.config.ts`](../../tailwind.config.ts)
- [`src/app/globals.css`](../../src/app/globals.css)
- [`src/app/page.tsx`](../../src/app/page.tsx)
