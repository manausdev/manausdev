# ADR 0019: Favicon a partir do símbolo da marca

**Status:** Aceito
**Data:** 2026-09-30
**Autor:** Mike Medeiros (@UmTalDeMike)

## Contexto

O site não tinha favicon. Não havia `favicon.ico`, `icon.*` nem `apple-icon.*` em
`src/app/` ou em `public/`, e o `layout.tsx` não declara `icons` em `metadata`. O
`TODO.md` marca "Criar favicon" como feito, mas nenhum arquivo existia: a aba do
navegador mostrava o ícone genérico.

A única fonte disponível do logo é um PNG de 60x60 px com o símbolo do M (gradiente
verde para azul, `</>` e o robô) e o texto "ManausDev" logo abaixo.

## Decisão

### Convenção de arquivo do App Router, sem código

Adicionar `src/app/favicon.ico`. O Next.js 16 detecta o arquivo pela convenção de
metadados do App Router e gera sozinho o `<link rel="icon">` com `sizes`. O
`layout.tsx` não muda e nenhuma dependência entra, o que respeita a regra de zero
dependências do `AGENTS.md`.

### Só o símbolo, sem o texto

O ICO carrega três tamanhos: 16, 32 e 48 px. Em 16 e 32 px o texto "ManausDev" vira
ruído, então o favicon usa apenas o símbolo do M, recortado do ícone original com
fundo escuro da própria arte. As cores continuam as do logo, que são a origem da
paleta Blue-Tech do [ADR 0015](0015-rebrand-blue-tech-palette-and-dark-mode.md).

### PNGs internos em RGBA

Cada tamanho dentro do `.ico` é um PNG em RGBA. Com PNG em RGB, o Next.js 16 não
decodifica o arquivo e a **home inteira** responde 500:

```
Format error decoding Ico: The PNG is not in RGBA format!
```

O `/favicon.ico` continua respondendo 200 nesse caso, então conferir só a URL do
ícone não revela o problema.

### Fonte versionada

O ícone original fica em `public/assets/icone-manausdev.png`, ao lado dos outros
assets de marca, para que o favicon possa ser regerado.

## Verificação

- `next dev`: `/favicon.ico` responde 200 com o arquivo versionado; a home responde
  200 e o HTML contém `<link rel="icon" href="/favicon.ico?..." sizes="48x48" type="image/x-icon"/>`.
- Com o ICO em RGB (primeira tentativa), a home respondia 500 com o erro acima.
- `npm test` (103 testes) e `npm run typecheck` passam.

## Consequências

- **Positivas:** a aba, os favoritos e o histórico passam a mostrar a marca; nenhuma
  linha de código nem dependência nova.
- **Negativas:** quem regerar o favicon precisa manter os PNGs internos em RGBA, ou a
  home volta a dar 500.
- **Limite:** a fonte tem 60x60 px. Ícones grandes, como `apple-icon` (180 px) e os
  de PWA (192 e 512 px), ficariam borrados se ampliados a partir dela. Ficam para
  quando existir o logo em alta resolução ou em SVG.

## Referências

- Convenção de arquivos de ícone do Next.js (App Router): `favicon`, `icon` e `apple-icon`.
- [ADR 0015: Rebrand para a paleta Blue-Tech](0015-rebrand-blue-tech-palette-and-dark-mode.md)
