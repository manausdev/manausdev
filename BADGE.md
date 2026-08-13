# Badge "Feito em Manaus"

Badge oficial do projeto ManausDev. Use-o no seu README, site ou documentação para mostrar que o projeto foi construído em Manaus.

## Arquivos

- `assets/images/feito-em-manaus.svg` — Badge principal (modo claro)
- `assets/images/feito-em-manaus-dark.svg` — Badge para modo escuro
- `assets/images/feito-em-manaus.png` — Versão rasterizada (PNG)

## Uso em Markdown

### README.md (modo claro)

```markdown
![Feito em Manaus](assets/images/feito-em-manaus.svg)
```

### README.md (modo escuro com seletor de tema)

```markdown
<picture>
  <source srcset="assets/images/feito-em-manaus-dark.svg" media="(prefers-color-scheme: dark)">
  <img src="assets/images/feito-em-manaus.svg" alt="Feito em Manaus">
</picture>
```

### Badge para perfis GitHub / repositórios públicos

```markdown
![Feito em Manaus](https://raw.githubusercontent.com/manausdev/manausdev/main/assets/images/feito-em-manaus.svg)
```

## Uso em HTML

```html
<picture>
  <source srcset="assets/images/feito-em-manaus-dark.svg" media="(prefers-color-scheme: dark)">
  <img src="assets/images/feito-em-manaus.svg" alt="Feito em Manaus" width="140" height="42">
</picture>
```

## Customização

Você pode alterar as dimensões mantendo a proporção. O SVG é escalável, então também é possível usar estilos CSS:

```css
.badge-feito-em-manaus {
  height: 42px;
  width: auto;
}
```

## Licença

Sinta-se livre para usar este badge em projetos pessoais e comerciais ligados à comunidade ManausDev.