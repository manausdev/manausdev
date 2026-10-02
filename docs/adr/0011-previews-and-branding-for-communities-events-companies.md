# ADR 0011: Visual Previews e Identidade para Comunidades, Eventos e Empresas

**Status:** Aceito  
**Data:** 2026-08-19  
**Autor:** Equipe ManausDev  

## Contexto

Dando continuidade à padronização do Design System e elevação da experiência visual iniciada nos Projetos (ADR 0010), as páginas de **Comunidades**, **Eventos** e **Empresas** necessitavam de recursos visuais ricos (banners de preview, mockups fotográficos e logotipos dedicados) para destacar a vitalidade do ecossistema de Manaus.

## Decisão

1. **Comunidades ([`src/app/comunidades/page.tsx`](../../src/app/comunidades/page.tsx)):**
   - Header visual (`h-40`) com imagem de preview da comunidade/encontros.
   - Badge flutuante indicando contagem de membros ativos (`+ membros`).
   - Avatar com monograma de destaque e links de acesso direto com estilo de chip interativo.

2. **Eventos ([`src/app/eventos/page.tsx`](../../src/app/eventos/page.tsx)):**
   - Header visual (`h-44`) com foto de capa do meetup/hackathon.
   - Badges duplos para categoria do evento (`meetup`, `hackathon`, etc.) e data formatada com background translúcido.
   - Botão de ação de alta conversão para inscrição no evento (`btn-leaf`).

3. **Empresas ([`src/app/empresas/page.tsx`](../../src/app/empresas/page.tsx)):**
   - Header visual (`h-36`) para instalações/escritórios e badge de porte da empresa (`50-200`, `500+`).
   - Ícone/Logo dedicado (`w-11 h-11`) exibindo o logotipo da organização ou monograma estilizado com fallback.

4. **Tipagem e Mocks:**
   - Atualizadas interfaces TypeScript (`Community`, `EventItem`, `Company`) em [`src/types/database.ts`](../../src/types/database.ts).
   - Populadas propriedades `image_url` e `logo_url` nos mocks de [`src/lib/data/mock.ts`](../../src/lib/data/mock.ts).

## Consequências

- Uniformidade estética completa em todas as rotas de listagem do portal (`/projetos`, `/comunidades`, `/eventos`, `/empresas`).
- Suporte a fallbacks elegantes caso alguma entidade não possua imagem/logo cadastrado.
