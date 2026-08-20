# 🌿 ManausDev

> **Quem constrói tecnologia em Manaus está aqui.**

Plataforma comunitária moderna para conectar desenvolvedores, projetos open-source, empresas, vagas de trabalho e eventos de tecnologia no estado do Amazonas.

---

## ⚡ Stack Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19, Server & Client Components)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com identidade visual **Cyber-Amazônica**
- **BaaS & Backend:** [Supabase](https://supabase.com/) (`@supabase/ssr` e `@supabase/supabase-js`)
- **Banco de Dados:** PostgreSQL com Row Level Security (RLS) e triggers automáticos
- **Autenticação:** Supabase Auth (Email/Senha + OAuth GitHub) com middleware de sessão SSR

---

## 📁 Estrutura do Projeto

```text
manausdev/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout com tipografia regional e SEO
│   │   ├── page.tsx                # Landing page interativa
│   │   ├── globals.css             # Design tokens Cyber-Amazônicos & glassmorphism
│   │   ├── devs/page.tsx           # Diretório de desenvolvedores com busca & filtros
│   │   ├── projetos/page.tsx       # Vitrine de projetos e startups locais
│   │   ├── vagas/page.tsx          # Mural de vagas (PIM, Polo Digital e Remoto)
│   │   ├── comunidades/page.tsx    # Comunidades técnicas de Manaus
│   │   ├── eventos/page.tsx        # Agenda de meetups, hackathons e confs
│   │   ├── empresas/page.tsx       # Empresas e Institutos de P&D de Manaus
│   │   ├── dashboard/page.tsx      # Painel do membro (edição de perfil e projetos)
│   │   ├── auth/
│   │   │   ├── login/page.tsx      # Login via Email e GitHub
│   │   │   ├── register/page.tsx   # Cadastro de novo usuário
│   │   │   └── callback/route.ts   # Troca de código de autenticação SSR
│   │   ├── sobre/page.tsx          # Manifesto e informações institucionais
│   │   ├── contato/page.tsx        # Formulário de contato
│   │   ├── termos/page.tsx         # Termos de uso
│   │   └── privacidade/page.tsx    # Política de privacidade (LGPD)
│   ├── components/
│   │   ├── navbar.tsx              # Header responsivo com estado de autenticação
│   │   ├── footer.tsx              # Rodapé com selo "Feito em Manaus"
│   │   └── icons.tsx               # Ícones vetoriais
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Cliente Supabase para o Browser
│   │   │   ├── server.ts           # Cliente Supabase SSR com Cookies
│   │   │   └── middleware.ts       # Validação e renovação de sessão
│   │   ├── data/
│   │   │   └── mock-data.ts        # Dados de fallback para desenvolvimento local
│   │   └── utils.ts                # Utilitários de classes e formatação
│   ├── middleware.ts               # Middleware do Next.js para proteção de rotas
│   └── types/
│       └── database.ts             # Tipos TypeScript do schema Supabase
├── supabase/
│   ├── schema.sql                  # DDL das tabelas, RLS e triggers do PostgreSQL
│   └── seed.sql                    # Carga inicial de dados mock
├── scripts/                        # Scripts REST API / Automações (intactos)
├── .env.example                    # Exemplo de variáveis de ambiente
└── package.json
```

---

## 🚀 Como Executar Localmente

### 1. Clonar e Instalar Dependências

```bash
git clone https://github.com/ManausDev/manausdev.git
cd manausdev
npm install
```

### 2. Configurar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No painel do Supabase, acesse o **SQL Editor** e execute o script [`supabase/schema.sql`](file:///C:/Users/luann/Documents/GitHub/manausdev/supabase/schema.sql).
3. Opcionalmente, execute [`supabase/seed.sql`](file:///C:/Users/luann/Documents/GitHub/manausdev/supabase/seed.sql) para popular dados de teste.
4. Copie as variáveis de ambiente:

```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### 3. Executar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 4. Build de Produção

```bash
npm run build
npm run start
```

---

## 📜 Decisões de Arquitetura (ADRs)

Todas as decisões arquiteturais e evoluções de features são documentadas em formato ADR (Architecture Decision Records):

* Acesse o índice completo: [**`docs/adr/README.md`**](docs/adr/README.md)

---

## 📜 Licença

Distribuído sob a licença **Apache License 2.0**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
