# ManausDev

> Quem constrói tecnologia em Manaus está aqui.

Plataforma comunitária para conectar desenvolvedores, projetos, empresas e entusiastas de tecnologia de Manaus.

## Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend/BaaS:** Supabase
- **Banco de dados:** PostgreSQL (via Supabase)
- **Autenticação:** Supabase Auth
- **Storage:** Supabase Storage

## Estrutura do projeto

```text
manausdev/
├── index.html
├── pages/
│   ├── devs/
│   ├── projetos/
│   ├── empresas/
│   ├── vagas/
│   ├── equipes/
│   ├── eventos/
│   ├── comunidades/
│   └── conteudo/
├── css/
│   ├── global.css
│   ├── variables.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── api.js
│   ├── auth.js
│   ├── search.js
│   └── utils.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
└── README.md
```

## Como executar localmente

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conta no [Supabase](https://supabase.com/)

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/ManausDev/manausdev.git
cd manausdev
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

3. Execute o projeto:

```bash
# Com npm
npm run dev

# Ou com servidor estático simples
npx serve .
```

4. Acesse `http://localhost:5173` (ou a porta indicada pelo terminal).

## Contribuição

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para saber como contribuir.

## Licença

Este projeto está licenciado sob a [Apache License 2.0](LICENSE).
