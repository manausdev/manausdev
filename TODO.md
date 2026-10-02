# TODO — ManausDev

Roadmap técnico e de produto para construção da plataforma **ManausDev**.

> Quem constrói tecnologia em Manaus está aqui.

## Como ler este arquivo

Estado conferido contra o código da `main` e as configurações do GitHub em **2026-09-30** (ver [ADR 0020](docs/adr/0020-todo-reflects-verified-state.md)).

- `[x]` existe no código, no banco (`supabase/schema.sql`) ou nas configurações do GitHub.
- `[ ]` não existe, ou não há evidência no repositório. Itens de operação (backup, monitoramento, divulgação) podem existir fora do repositório: marque `[x]` quando houver evidência verificável.
- *parcial:* a nota diz o que existe e o que falta.

Ao marcar um item, deixe a evidência verificável: arquivo, rota, tabela ou PR.

---

## 0. Definição do projeto

- [ ] Definir missão da ManausDev — *parcial:* há texto em `/sobre`, sem documento de missão
- [ ] Definir público-alvo
- [ ] Definir escopo inicial
- [ ] Definir critérios para participação
- [ ] Definir o que caracteriza um projeto de Manaus
- [ ] Definir política para empresas
- [ ] Definir política para vagas
- [ ] Definir política para eventos
- [ ] Definir política para comunidades
- [ ] Definir política de moderação
- [ ] Definir regras para destaques
- [ ] Definir critérios para o selo "Feito em Manaus"
- [x] Definir licença do projeto — `LICENSE` (Apache-2.0)
- [x] Definir política de privacidade — `/privacidade`
- [x] Definir termos de uso — `/termos`
- [x] Definir código de conduta — `CODE_OF_CONDUCT.md`

---

# 1. Organização GitHub

## Organização

- [x] Criar organização `ManausDev`
- [x] Criar repositório `.github`
- [x] Criar `.github/profile/README.md`
- [x] Adicionar descrição da organização
- [ ] Adicionar site oficial — o campo de site da organização está vazio
- [x] Adicionar localização
- [x] Configurar avatar/logo
- [ ] Configurar redes sociais — nenhuma rede configurada na organização
- [x] Configurar Discussions
- [ ] Definir membros públicos da organização — a organização não tem membros públicos

## Repositório principal

- [x] Criar `ManausDev/manausdev`
- [x] Criar `README.md`
- [x] Criar `TODO.md`
- [x] Criar `CONTRIBUTING.md`
- [x] Criar `CODE_OF_CONDUCT.md`
- [x] Criar `SECURITY.md`
- [x] Criar `LICENSE`
- [x] Criar `.gitignore`
- [x] Criar templates de Issues
- [x] Criar template de Pull Request
- [ ] Configurar labels — só existem as labels padrão do GitHub; faltam as da seção 36
- [x] Configurar branch protection
- [x] Configurar Dependabot
- [x] Configurar GitHub Actions — o CI roda `typecheck`, testes e `build` em cada PR

---

# 2. Identidade visual

- [x] Criar logo ManausDev
- [ ] Criar versão horizontal — não há arquivo no repositório
- [x] Criar versão reduzida — `public/assets/icone-manausdev.png`
- [x] Criar favicon — `src/app/favicon.ico` (ADR 0019)
- [x] Definir tipografia
- [x] Definir paleta — ADR 0015
- [x] Definir identidade visual
- [x] Definir Design System — `DESIGN.md`, `src/atoms`, `src/molecules`
- [x] Criar componentes básicos
- [x] Definir padrões de espaçamento
- [x] Definir breakpoints
- [x] Definir modo claro
- [x] Definir modo escuro
- [ ] Criar Open Graph image — não há imagem em `public/` nem `opengraph-image` em `src/app/`
- [x] Criar identidade do selo "Feito em Manaus" — `public/assets/feito-em-manaus*.svg`

---

# 3. Arquitetura

## Frontend

A stack inicial em HTML/CSS/JS foi substituída por Next.js (App Router) + TypeScript ([ADR 0008](docs/adr/0008-migrate-to-nextjs-and-supabase.md)). Estilo em CSS Modules por componente, com o Tailwind em remoção (ver `AGENTS.md`).

- [x] Definir arquitetura do frontend
- [x] Separar páginas — `src/app/`
- [x] Separar componentes — `src/atoms`, `src/molecules`, `src/organisms`, `src/routes`
- [x] Separar estilos — CSS Modules
- [x] Criar módulos JavaScript
- [x] Criar cliente da API — `src/lib/supabase/{client,server,public}.ts`
- [x] Criar gerenciamento de estado simples
- [ ] Criar tratamento global de erros — não há `error.tsx` nem `not-found.tsx` próprios em `src/app/`
- [x] Criar sistema de configuração por ambiente — `src/lib/env.ts`, `.env.example`

Estrutura atual:

```text
manausdev/
├── src/
│   ├── app/            # rotas (App Router)
│   ├── atoms/          # componentes básicos
│   ├── molecules/
│   ├── organisms/      # Header, Footer, CookieConsent, ThemeToggle...
│   ├── routes/         # templates de página
│   ├── lib/            # supabase, dados, utilitários
│   ├── tokens/
│   └── types/
├── supabase/           # schema.sql, migrations/, seed.sql
├── public/assets/
├── docs/adr/
└── scripts/
```

---

# 4. Backend

- [x] Escolher backend — Supabase
- [x] Definir API — acesso direto ao Supabase com RLS
- [x] Definir banco de dados — PostgreSQL
- [x] Definir autenticação — Supabase Auth
- [ ] Definir armazenamento de arquivos — o código não usa Supabase Storage; imagens entram por URL
- [ ] Criar ambientes development/staging/production — sem evidência de staging
- [x] Configurar variáveis de ambiente
- [x] Configurar migrations — `supabase/migrations/`
- [x] Configurar seeds — `supabase/seed.sql`
- [ ] Implementar logs
- [ ] Implementar rate limiting
- [ ] Implementar validação — *parcial:* `check constraints` no banco e validação nos formulários; sem validação server-side própria
- [ ] Implementar tratamento de erros — *parcial:* `try/catch` por página, sem tratamento global
- [x] Implementar autorização — RLS por `profile_type` (ADR 0016)

Stack atual:

```text
Frontend        Next.js (App Router) + TypeScript
Backend/BaaS    Supabase
Banco           PostgreSQL com RLS
Auth            Supabase Auth (e-mail/senha e GitHub)
Storage         não utilizado
Hospedagem      Vercel
```

---

# 5. Banco de dados

Tabelas existentes: `profiles`, `companies`, `projects`, `communities`, `events`, `jobs`, `contacts`, `news` e `community_channels`.

Criar entidades:

- [x] `users` — `auth.users` do Supabase
- [x] `developers` — tabela `profiles`
- [ ] `skills` — hoje é a coluna `skills text[]` em `profiles`
- [ ] `developer_skills`
- [x] `projects`
- [ ] `project_members`
- [x] `companies`
- [x] `jobs`
- [ ] `team_requests`
- [x] `events`
- [x] `communities`
- [ ] `articles` — *parcial:* existe `news` (notícias)
- [ ] `tags`
- [ ] `likes`
- [ ] `bookmarks`
- [ ] `reports`

## Desenvolvedor

Campos iniciais:

```text
id
user_id
name
username
bio
avatar
role
seniority
city
state
github
linkedin
website
available_for_work
available_for_projects
created_at
updated_at
```

Colunas reais em `profiles`: `id`, `username`, `full_name`, `avatar_url`, `role`, `profile_type`, `bio`, `location`, `city`, `seniority`, `availability`, `skills`, `github`, `website`, `linkedin`, `is_admin`, `created_at`, `updated_at`.

- [x] Nome
- [x] Username
- [x] Avatar
- [x] Bio
- [x] Cargo/área
- [x] Senioridade
- [x] Stack
- [x] GitHub
- [x] LinkedIn
- [x] Site
- [x] Projetos — `projects.author_id`
- [ ] Open Source
- [ ] Comunidades — não há relação entre perfil e comunidade
- [x] Disponibilidade profissional — `availability`
- [ ] Disponibilidade para projetos — não há campo separado

URL:

```text
/devs/username
```

## Edição

- [x] Editar informações — `/dashboard`
- [ ] Editar avatar — o avatar vem do GitHub no cadastro e não é editável
- [x] Adicionar tecnologias
- [x] Adicionar redes
- [x] Configurar disponibilidade
- [ ] Configurar privacidade

---

# 6. Autenticação

- [x] Cadastro
- [x] Login
- [x] Logout
- [ ] Recuperação de senha
- [x] Confirmação de e-mail
- [x] Login com GitHub
- [ ] Login com Google
- [x] Sessão persistente
- [x] Proteção de páginas privadas — só no cliente (ADR 0014); a proteção dos dados é o RLS
- [ ] Exclusão de conta
- [ ] Exportação dos dados pessoais

---

# 7. Perfil de desenvolvedor

## Página pública

- [x] Nome
- [x] Username
- [x] Avatar
- [x] Bio
- [x] Cargo/área
- [x] Senioridade
- [x] Stack
- [x] GitHub
- [x] LinkedIn
- [x] Site
- [x] Projetos
- [ ] Open Source
- [ ] Comunidades
- [x] Disponibilidade profissional
- [ ] Disponibilidade para projetos

URL:

```text
/devs/username
```

## Edição

- [x] Editar informações
- [ ] Editar avatar
- [x] Adicionar tecnologias
- [x] Adicionar redes
- [x] Configurar disponibilidade
- [ ] Configurar privacidade

---

# 8. Diretório de desenvolvedores

- [x] Página `/devs`
- [x] Cards
- [x] Paginação
- [x] Busca por nome
- [x] Busca por tecnologia
- [ ] Filtro por área
- [x] Filtro por senioridade
- [x] Filtro por disponibilidade
- [x] Ordenação
- [x] URL compartilhável dos filtros

Exemplo:

```text
/devs?stack=rust
/devs?stack=python
/devs?stack=react&available=true
```

---

# 9. Projetos

- [x] Página `/projetos`
- [x] Cadastro de projeto — pelo `/dashboard`
- [x] Edição
- [x] Exclusão
- [x] Página individual
- [x] Nome
- [x] Descrição
- [x] Screenshots — *parcial:* uma imagem por projeto (`image_url`)
- [x] Stack
- [x] Repositório
- [x] Demo
- [ ] Site — o formulário junta site e demo em um campo só
- [ ] Equipe
- [ ] Status
- [ ] Licença
- [ ] Open Source
- [ ] Procura colaboradores
- [ ] Compartilhamento

URL:

```text
/projetos/nome-do-projeto
```

Hoje a URL usa o id (`/projetos/<uuid>`), não o nome.

---

# 10. Integração GitHub

- [x] Login com GitHub
- [ ] Vincular conta GitHub — só login, sem vincular a uma conta existente
- [x] Importar avatar — no cadastro, pelo trigger `handle_new_user`
- [ ] Importar bio
- [ ] Importar repositórios
- [ ] Selecionar projetos para publicar
- [ ] Importar linguagens
- [ ] Mostrar stars
- [ ] Mostrar forks
- [ ] Mostrar última atualização
- [ ] Atualização periódica
- [ ] Respeitar limites da API

---

# 11. Empresas

- [x] Diretório `/empresas`
- [x] Página da empresa
- [ ] Cadastro — o RLS permite, mas não há tela
- [x] Logo
- [x] Descrição
- [x] Site
- [ ] Redes
- [ ] Tecnologias
- [ ] Projetos
- [x] Vagas
- [ ] Desenvolvedores relacionados
- [ ] Processo de verificação
- [ ] Empresa verificada

---

# 12. Vagas

- [x] Página `/vagas`
- [ ] Publicar vaga — o RLS permite para `empresa` e `admin`, mas não há tela
- [ ] Editar vaga
- [ ] Remover vaga
- [ ] Expiração automática
- [x] Empresa
- [x] Cargo
- [ ] Senioridade — não há coluna em `jobs`
- [x] Stack
- [x] Salário opcional
- [x] CLT
- [x] PJ
- [x] Estágio
- [ ] Freelancer
- [x] Presencial
- [ ] Híbrido — `remote` é booleano
- [x] Remoto
- [x] Link de candidatura
- [x] Busca
- [x] Filtros

---

# 13. Procuro equipe

- [ ] Página `/equipes`
- [ ] Criar anúncio
- [ ] Projeto relacionado
- [ ] Função procurada
- [ ] Tecnologias
- [ ] Descrição
- [ ] Remunerado/não remunerado
- [ ] Contato
- [ ] Prazo
- [ ] Encerrar anúncio

Categorias:

```text
Frontend
Backend
Full Stack
Mobile
DevOps
UI/UX
Dados
IA/ML
Segurança
Hardware
Cofundador
Outros
```

---

# 14. Eventos

- [x] Página `/eventos`
- [ ] Cadastro — o RLS permite, mas não há tela
- [x] Nome
- [x] Descrição
- [x] Data
- [x] Horário
- [x] Local
- [ ] Evento online
- [ ] Organizador — `organizer_id` existe, mas não é exibido
- [x] Link
- [ ] Inscrição
- [x] Imagem — capa por tipo de evento (ADR 0011), sem upload
- [ ] Calendário
- [ ] Eventos futuros — a listagem não separa futuros de anteriores
- [ ] Eventos anteriores

---

# 15. Comunidades

- [x] Página `/comunidades`
- [ ] Cadastro — não há tela nem policy de insert
- [x] Nome
- [x] Descrição
- [ ] Logo — `logo_url` existe, mas não é exibido
- [ ] Tecnologias
- [x] Site — pelo campo `links`
- [x] GitHub — pelo campo `links`
- [x] Discord — `links` e `/canais`
- [x] Telegram — `links` e `/canais`
- [x] WhatsApp — `links` e `/canais`
- [x] LinkedIn — pelo campo `links`
- [ ] Eventos
- [ ] Administradores
- [ ] Verificação

---

# 16. Conteúdo

- [ ] Página `/conteudo` — *parcial:* existe `/noticias` (listagem e detalhe)
- [ ] Artigos — *parcial:* notícias
- [ ] Tutoriais
- [ ] Relatos
- [ ] Pesquisa
- [ ] Conteúdo acadêmico
- [ ] Tags — *parcial:* `news.category`
- [x] Autor — `news.author_id`
- [ ] Markdown
- [ ] Preview
- [ ] Rascunho — o campo `news.published` existe, mas não há editor
- [ ] Publicação — não há tela para criar notícia
- [ ] Moderação

---

# 17. Destaques

Criar:

- [ ] Projeto da semana — *parcial:* `projects.featured` e projeto em destaque na home
- [ ] Desenvolvedor em destaque
- [ ] Empresa/startup em destaque
- [ ] Comunidade em destaque
- [ ] Evento em destaque

Definir:

- [ ] Critérios
- [ ] Processo de indicação
- [ ] Curadoria
- [ ] Histórico de destaques

Evitar transformar o sistema apenas em competição por votos.

---

# 18. Busca global

Criar busca para:

```text
Devs
Projetos
Empresas
Vagas
Eventos
Comunidades
Conteúdo
```

Hoje cada listagem tem busca própria; não existe busca global.

- [ ] Busca textual
- [ ] Autocomplete
- [ ] Filtros
- [ ] Ordenação
- [ ] Página de resultados
- [ ] Busca por tags
- [ ] Busca por tecnologias

---

# 19. Homepage

Criar seções:

- [x] Hero
- [ ] Busca global
- [x] Estatísticas
- [x] Projetos em destaque
- [x] Desenvolvedores
- [x] Vagas recentes
- [x] Próximos eventos
- [ ] Comunidades — só o contador
- [ ] Empresas
- [ ] Conteúdo recente
- [x] CTA para cadastro

Possíveis métricas:

```text
Desenvolvedores
Projetos
Empresas
Comunidades
Vagas
Eventos
```

---

# 20. Dashboard

Criar `/dashboard`.

- [ ] Visão geral
- [x] Editar perfil
- [x] Meus projetos
- [ ] Minhas vagas
- [ ] Meus anúncios
- [ ] Eventos
- [ ] Favoritos
- [ ] Configurações
- [ ] Conta
- [ ] Privacidade

Existe também a curadoria de tipo de perfil para administradores (`AdminProfileTypes`).

---

# 21. Sistema de moderação

Papéis:

```text
user
moderator
admin
```

Hoje os tipos são `dev`, `empresa` e `admin` (`profiles.profile_type`, ADR 0016); não há `moderator`.

- [ ] Denunciar perfil
- [ ] Denunciar projeto
- [ ] Denunciar vaga
- [ ] Denunciar empresa
- [ ] Denunciar conteúdo
- [ ] Fila de moderação
- [ ] Aprovar
- [ ] Rejeitar
- [ ] Ocultar
- [ ] Suspender usuário
- [ ] Banir usuário
- [ ] Registrar ações administrativas
- [ ] Sistema de recurso

---

# 22. Segurança

- [x] HTTPS — hospedagem na Vercel
- [ ] CSP — `next.config.mjs` não define headers
- [ ] CORS
- [ ] CSRF quando aplicável
- [x] Proteção contra XSS — escape padrão do React; `dangerouslySetInnerHTML` só em JSON-LD e no script de tema
- [ ] Sanitização — *parcial:* sanitização de username no cadastro
- [ ] Validação server-side — *parcial:* `check constraints` no banco
- [ ] Rate limiting
- [ ] Proteção contra spam — o formulário de contato aceita insert anônimo sem limite
- [ ] Proteção contra bots
- [x] Controle de permissões — `profile_type` e trigger anti-escalação (ADR 0016)
- [x] RLS no banco quando aplicável
- [x] Secrets fora do repositório
- [x] Auditoria de dependências — Dependabot
- [ ] Backup
- [ ] Logs de segurança
- [x] Política de disclosure — `SECURITY.md`

---

# 23. LGPD e privacidade

- [ ] Mapear dados pessoais coletados
- [ ] Definir bases legais aplicáveis
- [x] Coletar somente dados necessários — o e-mail fica só em `auth.users`, fora de `profiles`
- [x] Consentimento quando necessário — banner de cookies (`CookieConsent`)
- [x] Política de privacidade
- [x] Termos de uso
- [ ] Exclusão da conta — citada em `/privacidade`, sem funcionalidade
- [ ] Exclusão dos dados
- [x] Correção de dados — edição de perfil no `/dashboard`
- [ ] Exportação de dados
- [ ] Definir retenção
- [ ] Canal para solicitações de titulares — *parcial:* formulário genérico em `/contato`
- [ ] Política para conteúdo público

Não publicar automaticamente informações pessoais encontradas na internet.

---

# 24. SEO

Perfis e projetos devem poder aparecer nos mecanismos de busca.

- [ ] URLs amigáveis — *parcial:* `/devs/username` sim; projetos, vagas e eventos usam uuid
- [ ] `<title>` — *parcial:* só o título global do `layout.tsx`; as páginas não têm título próprio
- [ ] Meta description — *parcial:* só a global
- [ ] Canonical
- [ ] Open Graph — *parcial:* título e descrição globais, sem imagem
- [ ] Twitter/X Cards
- [ ] Sitemap
- [ ] Robots.txt
- [x] Structured Data
- [ ] Schema.org Person
- [x] Schema.org Organization
- [x] Schema.org JobPosting
- [ ] Schema.org Event
- [x] Schema.org Article — `NewsArticle` em `/noticias/[id]`

---

# 25. Acessibilidade

Meta inicial: WCAG 2.2 AA.

- [x] HTML semântico
- [ ] Navegação por teclado — sem evidência de teste
- [x] Focus states
- [x] Labels — `FormField`
- [ ] ARIA somente quando necessário
- [ ] Contraste adequado — *parcial:* revisado por página na migração de CSS (ADR 0017)
- [ ] Alt text
- [ ] Skip navigation
- [x] Formulários acessíveis
- [ ] Testar leitores de tela
- [x] Respeitar `prefers-reduced-motion`

---

# 26. Responsividade

Testar:

- [ ] Desktop
- [ ] Notebook
- [ ] Tablet
- [ ] Smartphone

Há media queries nos CSS Modules, mas não há registro de teste por dispositivo.

Breakpoints devem ser definidos pelo conteúdo, não por modelos específicos de dispositivos.

---

# 27. Performance

- [x] Minificar CSS — `next build`
- [x] Minificar JS — `next build`
- [ ] Lazy loading
- [ ] Compressão de imagens — `images.unoptimized: true` em `next.config.mjs`
- [ ] WebP/AVIF
- [ ] Cache
- [x] CDN — Vercel
- [x] Code splitting quando necessário — automático no App Router
- [ ] Reduzir JavaScript desnecessário
- [ ] Lighthouse
- [ ] Core Web Vitals

---

# 28. Testes

Hoje existem testes de componente (Vitest + Testing Library) para atoms, molecules, organisms e templates, e testes de tokens e de CSS Modules. O CI não roda esses testes.

## Unitários

- [ ] Utils
- [ ] Validação
- [ ] Filtros
- [ ] Formatação

## Integração

- [ ] Auth
- [ ] Perfil
- [ ] Projetos
- [ ] Vagas
- [ ] Empresas

## E2E

Testar fluxos:

```text
Cadastro
    ↓
Criar perfil
    ↓
Cadastrar projeto
    ↓
Publicar
    ↓
Encontrar projeto na busca
```

- [ ] Desktop
- [ ] Mobile
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari

---

# 29. Analytics

Coletar apenas métricas necessárias.

- [ ] Visitantes
- [ ] Perfis visualizados
- [ ] Projetos visualizados
- [ ] Cliques em vagas
- [ ] Cliques em GitHub
- [ ] Cliques em projetos
- [ ] Buscas
- [ ] Tecnologias mais pesquisadas
- [ ] Eventos acessados

Evitar analytics invasivo.

---

# 30. Selo "Feito em Manaus"

Criar badge:

```text
Feito em Manaus
```

- [x] SVG
- [x] PNG
- [x] Markdown — `BADGE.md`
- [x] HTML — `BADGE.md`
- [ ] Página explicativa — *parcial:* `BADGE.md` no repositório, sem página no site
- [ ] Critérios de utilização
- [ ] Link para o projeto na ManausDev

Exemplo:

```md
[![Feito em Manaus](URL_DO_BADGE)](URL_DO_PROJETO)
```

---

# 31. Open Data

No futuro, disponibilizar estatísticas agregadas do ecossistema.

Exemplos:

```text
Tecnologias mais utilizadas
Quantidade de desenvolvedores
Projetos Open Source
Empresas
Comunidades
Eventos
Áreas de atuação
```

- [ ] Definir quais informações podem ser abertas
- [ ] Anonimização quando necessária
- [ ] API pública
- [ ] Dataset
- [ ] Documentação
- [ ] Licença dos dados

---

# 32. API pública

Planejar:

```text
GET /developers
GET /developers/:username

GET /projects
GET /projects/:slug

GET /companies
GET /jobs
GET /events
GET /communities
```

- [ ] Versionamento
- [ ] Documentação
- [ ] Rate limiting
- [ ] API keys se necessárias
- [ ] OpenAPI
- [ ] Política de uso

---

# 33. Administração

Criar painel administrativo.

- [ ] Dashboard
- [ ] Usuários — *parcial:* troca de `profile_type` no `/dashboard` para administradores
- [ ] Projetos
- [ ] Empresas
- [ ] Vagas
- [ ] Eventos
- [ ] Comunidades
- [ ] Artigos
- [ ] Denúncias
- [ ] Destaques
- [ ] Estatísticas
- [ ] Logs

---

# 34. Infraestrutura

- [ ] Registrar domínio — hoje o site roda em `manausdev.vercel.app`
- [ ] Configurar DNS
- [x] Configurar hospedagem — Vercel
- [x] Configurar banco — Supabase
- [ ] Configurar storage
- [x] Configurar CDN — Vercel
- [x] Configurar SSL — Vercel
- [ ] Configurar CI/CD — *parcial:* deploy pela Vercel; CI sem testes nem build
- [ ] Configurar staging
- [x] Configurar produção
- [ ] Backups automáticos
- [ ] Monitoramento
- [ ] Error tracking
- [ ] Uptime monitoring

---

# 35. Observabilidade

- [ ] Logs estruturados
- [ ] Logs de erro
- [ ] Métricas
- [ ] Alertas
- [ ] Monitoramento de disponibilidade
- [ ] Monitoramento da API
- [ ] Monitoramento do banco
- [ ] Monitoramento de jobs
- [ ] Dashboard operacional

---

# 36. Comunidade Open Source

Criar documentação para novos contribuidores.

- [x] Como executar localmente — `README.md`
- [x] Como contribuir — `CONTRIBUTING.md`
- [x] Como abrir Issue
- [x] Como enviar PR
- [x] Convenção de commits
- [x] Guia de estilo — `AGENTS.md`, `DESIGN.md`
- [x] Arquitetura — `docs/adr/`
- [ ] Good First Issues — a label existe, sem issues abertas
- [ ] Help Wanted — a label existe, sem issues abertas
- [x] Discussions
- [x] Roadmap público — este arquivo

Labels:

```text
good first issue
help wanted
bug
feature
documentation
design
frontend
backend
security
community
```

Existem hoje: `good first issue`, `help wanted`, `bug`, `documentation`. Faltam: `feature`, `design`, `frontend`, `backend`, `security`, `community`.

---

# 37. Seed inicial da comunidade

Antes do lançamento, cadastrar conteúdo suficiente para o portal não parecer vazio.

O `supabase/seed.sql` cria 6 empresas, 7 comunidades, 6 eventos e 5 vagas, sem perfis nem projetos.

Meta inicial:

- [ ] 20+ desenvolvedores
- [ ] 10+ projetos
- [x] 5+ empresas — no seed
- [x] 5+ comunidades — no seed
- [x] Eventos relevantes — no seed
- [x] Vagas disponíveis — no seed

Sempre obter autorização quando necessária para criação de perfis em nome de terceiros.

---

# 38. Beta fechado

- [ ] Selecionar primeiros participantes
- [ ] Criar formulário de feedback
- [ ] Testar cadastro
- [ ] Testar criação de perfil
- [ ] Testar projetos
- [ ] Testar busca
- [ ] Corrigir bugs
- [ ] Avaliar UX
- [ ] Avaliar performance
- [ ] Avaliar segurança

---

# 39. Beta público

- [ ] Liberar cadastro
- [ ] Divulgar nas comunidades
- [ ] Divulgar nas universidades
- [ ] Divulgar entre empresas
- [ ] Convidar projetos locais
- [ ] Coletar feedback
- [ ] Monitorar erros
- [ ] Monitorar abuso
- [ ] Publicar roadmap

---

# 40. Lançamento

- [ ] Domínio funcionando
- [x] HTTPS
- [ ] Analytics
- [ ] Monitoramento
- [ ] Backups
- [ ] SEO
- [ ] Sitemap
- [ ] LGPD
- [x] Termos
- [x] Política de privacidade
- [x] Código de Conduta
- [ ] Segurança
- [ ] Moderação
- [ ] Testes críticos
- [ ] Mobile
- [ ] Performance
- [x] Página de status/contato — `/contato`
- [ ] Divulgação oficial

---

# 41. Pós-lançamento

Acompanhar:

```text
Usuários ativos
Novos desenvolvedores
Projetos cadastrados
Projetos Open Source
Empresas
Vagas
Comunidades
Eventos
Contribuidores
Retenção
Buscas
Cliques em oportunidades
```

- [ ] Entrevistar usuários
- [ ] Identificar funcionalidades pouco utilizadas
- [ ] Melhorar onboarding
- [ ] Melhorar descoberta
- [ ] Melhorar busca
- [ ] Melhorar moderação
- [ ] Revisar segurança
- [ ] Revisar custos
- [ ] Publicar changelog

---

# MVP — estado em 2026-09-30

O que funciona hoje, de ponta a ponta:

- [x] Homepage com hero, estatísticas, desenvolvedores, projeto em destaque, vagas, próximos eventos e CTA
- [x] Cadastro e login (e-mail/senha e GitHub) com sessão persistente
- [x] Perfil público de desenvolvedor (`/devs/[username]`)
- [x] Diretório de desenvolvedores (`/devs`) com busca, filtros, ordenação e paginação
- [x] Cadastro, edição e exclusão de projetos pelo `/dashboard`
- [x] Diretório de projetos (`/projetos`) com busca e filtro por tecnologia
- [x] Página individual do projeto (`/projetos/[id]`)
- [x] Listagens e detalhes de vagas, empresas, eventos, comunidades, canais e notícias
- [x] Stack/tags nos projetos e perfis
- [x] GitHub e LinkedIn no perfil
- [x] Formulário de contato gravando em `contacts`
- [x] Banner de consentimento de cookies, termos e política de privacidade
- [x] Tipos de perfil com RLS por tipo (`dev`, `empresa`, `admin`)
- [x] Deploy na Vercel

Ainda fora do MVP entregue:

- [ ] Busca global com autocomplete
- [ ] Cadastro pelo site de vagas, eventos, empresas, comunidades e notícias (o RLS já permite)
- [ ] Recuperação de senha, exclusão de conta e exportação de dados
- [ ] SEO por página (título, descrição, sitemap, robots)

---

# Objetivo

A ManausDev não deve ser apenas mais uma rede social.

O objetivo é construir uma infraestrutura comunitária para descobrir:

> **quem está construindo tecnologia em Manaus, o que está sendo construído e como outras pessoas podem participar.**

**ManausDev — Feito em Manaus. Construído pela comunidade.**
