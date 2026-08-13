# Guia de Contribuição

Obrigado por considerar contribuir com o **ManausDev**! Este guia explica como participar do projeto.

## Código de Conduta

Ao contribuir, você concorda em manter um ambiente respeitoso e acolhedor. Seja gentil, colaborativo e profissional.

## Como contribuir

### 1. Reporte bugs e sugira melhorias

Abra uma [Issue](https://github.com/ManausDev/manausdev/issues) descrevendo:

- O que você encontrou
- Passos para reproduzir
- Comportamento esperado
- Ambiente (navegador, sistema operacional, etc.)

### 2. Escolha uma tarefa

- Verifique as [Issues abertas](https://github.com/ManausDev/manausdev/issues)
- Comente na issue que quer trabalhar nela
- Aguarde atribuição antes de iniciar

### 3. Crie uma branch

```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

Nomes recomendados:

- `feature/` para novas funcionalidades
- `fix/` para correções de bugs
- `docs/` para documentação
- `style/` para ajustes de estilo
- `refactor/` para refatorações

### 4. Faça suas alterações

- Siga os padrões de código do projeto
- Escreva código limpo e legível
- Teste suas alterações

### 5. Commit

Mensagens de commit devem ser claras e descritivas:

```
feat: adiciona busca por tecnologia no diretório de devs
fix: corrige layout do card de projeto em telas pequenas
docs: atualiza seção de setup no README
```

### 6. Push e Pull Request

```bash
git push origin feature/nome-da-feature
```

Abra um Pull Request com:

- Título descritivo
- Descrição do que foi alterado
- Referência para a issue (ex: `Closes #123`)

## Requisitos para PR

- O código deve passar por revisão (code review)
- Deve manter compatibilidade com o MVP
- Não deve conter segredos ou credenciais

## Stack e convenções

- HTML semântico
- CSS com variáveis para tema
- JavaScript modular
- Seguir a estrutura de pastas do projeto

## Dúvidas?

Abra uma Discussion ou comente na issue correspondente.
