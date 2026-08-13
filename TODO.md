Para o repositório `ManausDev/manausdev`, eu faria o `TODO.md` já pensando no caminho **MVP → lançamento → comunidade → plataforma completa**, sem transformar a primeira versão em algo gigantesco.

# TODO — ManausDev

Roadmap técnico e de produto para construção da plataforma **ManausDev**.

> Quem constrói tecnologia em Manaus está aqui.

---

## 0. Definição do projeto

- [ ] Definir missão da ManausDev
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
- [ ] Definir licença do projeto
- [ ] Definir política de privacidade
- [ ] Definir termos de uso
- [ ] Definir código de conduta

---

# 1. Organização GitHub

## Organização

- [x] Criar organização `ManausDev`
- [x] Criar repositório `.github`
- [x] Criar `.github/profile/README.md`
- [x] Adicionar descrição da organização
- [x] Adicionar site oficial
- [x] Adicionar localização
- [x] Configurar avatar/logo
- [x] Configurar redes sociais
- [x] Configurar Discussions
- [x] Definir membros públicos da organização

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
- [x] Configurar labels
- [x] Configurar branch protection
- [x] Configurar Dependabot
- [x] Configurar GitHub Actions

---

# 2. Identidade visual

- [x] Criar logo ManausDev
- [x] Criar versão horizontal
- [x] Criar versão reduzida
- [x] Criar favicon
- [x] Definir tipografia
- [x] Definir paleta
- [x] Definir identidade visual
- [x] Definir Design System
- [x] Criar componentes básicos
- [x] Definir padrões de espaçamento
- [x] Definir breakpoints
- [x] Definir modo claro
- [x] Definir modo escuro
- [x] Criar Open Graph image
- [x] Criar identidade do selo "Feito em Manaus"

---

# 3. Arquitetura

## Frontend

Inicialmente:

```text
HTML
CSS
JavaScript
```

- [x] Definir arquitetura do frontend
- [x] Separar páginas
- [x] Separar componentes
- [x] Separar estilos
- [x] Criar módulos JavaScript
- [x] Criar cliente da API
- [x] Criar gerenciamento de estado simples
- [x] Criar tratamento global de erros
- [x] Criar sistema de configuração por ambiente

Estrutura inicial:

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
│
├── css/
│   ├── global.css
│   ├── variables.css
│   ├── components.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── api.js
│   ├── auth.js
│   ├── search.js
│   └── utils.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── README.md
```

---

# 4. Backend

- [x] Escolher backend
- [x] Definir API
- [x] Definir banco de dados
- [x] Definir autenticação
- [x] Definir armazenamento de arquivos
- [x] Criar ambientes development/staging/production
- [x] Configurar variáveis de ambiente
- [x] Configurar migrations
- [x] Configurar seeds
- [x] Implementar logs
- [x] Implementar rate limiting
- [x] Implementar validação
- [x] Implementar tratamento de erros
- [x] Implementar autorização

Possível stack inicial:

```text
Frontend
HTML + CSS + JavaScript

Backend/BaaS
Supabase

Banco
PostgreSQL

Auth
Supabase Auth

Storage
Supabase Storage
```

---

# 5. Banco de dados

Criar entidades:

- [x] `users`
- [x] `developers`
- [x] `skills`
- [x] `developer_skills`
- [x] `projects`
- [x] `project_members`
- [x] `companies`
- [x] `jobs`
- [x] `team_requests`
- [x] `events`
- [x] `communities`
- [x] `articles`
- [x] `tags`
- [x] `likes`
- [x] `bookmarks`
- [x] `reports`

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
- [x] Open Source
- [x] Comunidades
- [x] Disponibilidade profissional
- [x] Disponibilidade para projetos

URL:

```text
/devs/username
```

## Edição

- [x] Editar informações
- [x] Editar avatar
- [x] Adicionar tecnologias
- [x] Adicionar redes
- [x] Configurar disponibilidade
- [x] Configurar privacidade

---

# 6. Autenticação

- [x] Cadastro
- [x] Login
- [x] Logout
- [x] Recuperação de senha
- [x] Confirmação de e-mail
- [x] Login com GitHub
- [x] Login com Google
- [x] Sessão persistente
- [x] Proteção de páginas privadas
- [x] Exclusão de conta
- [x] Exportação dos dados pessoais

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
- [x] Open Source
- [x] Comunidades
- [x] Disponibilidade profissional
- [x] Disponibilidade para projetos

URL:

```text
/devs/username
```

## Edição

- [x] Editar informações
- [x] Editar avatar
- [x] Adicionar tecnologias
- [x] Adicionar redes
- [x] Configurar disponibilidade
- [x] Configurar privacidade

---

# 8. Diretório de desenvolvedores

- [x] Página `/devs`
- [x] Cards
- [x] Paginação
- [x] Busca por nome
- [x] Busca por tecnologia
- [x] Filtro por área
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
- [x] Cadastro de projeto
- [x] Edição
- [x] Exclusão
- [x] Página individual
- [x] Nome
- [x] Descrição
- [x] Screenshots
- [x] Stack
- [x] Repositório
- [x] Demo
- [x] Site
- [x] Equipe
- [x] Status
- [x] Licença
- [x] Open Source
- [x] Procura colaboradores
- [x] Compartilhamento

URL:

```text
/projetos/nome-do-projeto
```

---

# 10. Integração GitHub

- [ ] Login com GitHub
- [ ] Vincular conta GitHub
- [ ] Importar avatar
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

- [ ] Diretório `/empresas`
- [ ] Página da empresa
- [ ] Cadastro
- [ ] Logo
- [ ] Descrição
- [ ] Site
- [ ] Redes
- [ ] Tecnologias
- [ ] Projetos
- [ ] Vagas
- [ ] Desenvolvedores relacionados
- [ ] Processo de verificação
- [ ] Empresa verificada

---

# 12. Vagas

- [ ] Página `/vagas`
- [ ] Publicar vaga
- [ ] Editar vaga
- [ ] Remover vaga
- [ ] Expiração automática
- [ ] Empresa
- [ ] Cargo
- [ ] Senioridade
- [ ] Stack
- [ ] Salário opcional
- [ ] CLT
- [ ] PJ
- [ ] Estágio
- [ ] Freelancer
- [ ] Presencial
- [ ] Híbrido
- [ ] Remoto
- [ ] Link de candidatura
- [ ] Busca
- [ ] Filtros

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

- [ ] Página `/eventos`
- [ ] Cadastro
- [ ] Nome
- [ ] Descrição
- [ ] Data
- [ ] Horário
- [ ] Local
- [ ] Evento online
- [ ] Organizador
- [ ] Link
- [ ] Inscrição
- [ ] Imagem
- [ ] Calendário
- [ ] Eventos futuros
- [ ] Eventos anteriores

---

# 15. Comunidades

- [ ] Página `/comunidades`
- [ ] Cadastro
- [ ] Nome
- [ ] Descrição
- [ ] Logo
- [ ] Tecnologias
- [ ] Site
- [ ] GitHub
- [ ] Discord
- [ ] Telegram
- [ ] WhatsApp
- [ ] LinkedIn
- [ ] Eventos
- [ ] Administradores
- [ ] Verificação

---

# 16. Conteúdo

- [ ] Página `/conteudo`
- [ ] Artigos
- [ ] Tutoriais
- [ ] Relatos
- [ ] Pesquisa
- [ ] Conteúdo acadêmico
- [ ] Tags
- [ ] Autor
- [ ] Markdown
- [ ] Preview
- [ ] Rascunho
- [ ] Publicação
- [ ] Moderação

---

# 17. Destaques

Criar:

- [ ] Projeto da semana
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
- [x] Busca global
- [x] Estatísticas
- [x] Projetos em destaque
- [x] Desenvolvedores
- [x] Vagas recentes
- [x] Próximos eventos
- [x] Comunidades
- [x] Empresas
- [x] Conteúdo recente
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

- [x] Visão geral
- [x] Editar perfil
- [x] Meus projetos
- [x] Minhas vagas
- [x] Meus anúncios
- [x] Eventos
- [x] Favoritos
- [x] Configurações
- [x] Conta
- [x] Privacidade

---

# 21. Sistema de moderação

Papéis:

```text
user
moderator
admin
```

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

- [ ] HTTPS
- [ ] CSP
- [ ] CORS
- [ ] CSRF quando aplicável
- [ ] Proteção contra XSS
- [ ] Sanitização
- [ ] Validação server-side
- [ ] Rate limiting
- [ ] Proteção contra spam
- [ ] Proteção contra bots
- [ ] Controle de permissões
- [ ] RLS no banco quando aplicável
- [ ] Secrets fora do repositório
- [ ] Auditoria de dependências
- [ ] Backup
- [ ] Logs de segurança
- [ ] Política de disclosure

---

# 23. LGPD e privacidade

- [ ] Mapear dados pessoais coletados
- [ ] Definir bases legais aplicáveis
- [ ] Coletar somente dados necessários
- [ ] Consentimento quando necessário
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] Exclusão da conta
- [ ] Exclusão dos dados
- [ ] Correção de dados
- [ ] Exportação de dados
- [ ] Definir retenção
- [ ] Canal para solicitações de titulares
- [ ] Política para conteúdo público

Não publicar automaticamente informações pessoais encontradas na internet.

---

# 24. SEO

Perfis e projetos devem poder aparecer nos mecanismos de busca.

- [x] URLs amigáveis
- [x] `<title>`
- [x] Meta description
- [x] Canonical
- [x] Open Graph
- [x] Twitter/X Cards
- [x] Sitemap
- [x] Robots.txt
- [x] Structured Data
- [x] Schema.org Person
- [x] Schema.org Organization
- [x] Schema.org JobPosting
- [x] Schema.org Event
- [x] Schema.org Article

---

# 25. Acessibilidade

Meta inicial: WCAG 2.2 AA.

- [x] HTML semântico
- [x] Navegação por teclado
- [x] Focus states
- [x] Labels
- [x] ARIA somente quando necessário
- [x] Contraste adequado
- [x] Alt text
- [x] Skip navigation
- [x] Formulários acessíveis
- [x] Testar leitores de tela
- [x] Respeitar `prefers-reduced-motion`

---

# 26. Responsividade

Testar:

- [x] Desktop
- [x] Notebook
- [x] Tablet
- [x] Smartphone

Breakpoints devem ser definidos pelo conteúdo, não por modelos específicos de dispositivos.

---

# 27. Performance

- [ ] Minificar CSS
- [ ] Minificar JS
- [ ] Lazy loading
- [ ] Compressão de imagens
- [ ] WebP/AVIF
- [ ] Cache
- [ ] CDN
- [ ] Code splitting quando necessário
- [ ] Reduzir JavaScript desnecessário
- [ ] Lighthouse
- [ ] Core Web Vitals

---

# 28. Testes

## Unitários

- [x] Utils
- [x] Validação
- [x] Filtros
- [x] Formatação

## Integração

- [x] Auth
- [x] Perfil
- [x] Projetos
- [x] Vagas
- [x] Empresas

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

- [x] Desktop
- [x] Mobile
- [x] Chrome
- [x] Firefox
- [x] Edge
- [x] Safari

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

- [ ] SVG
- [ ] PNG
- [ ] Markdown
- [ ] HTML
- [ ] Página explicativa
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
- [ ] Usuários
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

- [ ] Registrar domínio
- [ ] Configurar DNS
- [ ] Configurar hospedagem
- [ ] Configurar banco
- [ ] Configurar storage
- [ ] Configurar CDN
- [ ] Configurar SSL
- [ ] Configurar CI/CD
- [ ] Configurar staging
- [ ] Configurar produção
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

- [ ] Como executar localmente
- [ ] Como contribuir
- [ ] Como abrir Issue
- [ ] Como enviar PR
- [ ] Convenção de commits
- [ ] Guia de estilo
- [ ] Arquitetura
- [ ] Good First Issues
- [ ] Help Wanted
- [ ] Discussions
- [ ] Roadmap público

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

---

# 37. Seed inicial da comunidade

Antes do lançamento, cadastrar conteúdo suficiente para o portal não parecer vazio.

Meta inicial:

- [ ] 20+ desenvolvedores
- [ ] 10+ projetos
- [ ] 5+ empresas
- [ ] 5+ comunidades
- [ ] Eventos relevantes
- [ ] Vagas disponíveis

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
- [ ] HTTPS
- [ ] Analytics
- [ ] Monitoramento
- [ ] Backups
- [ ] SEO
- [ ] Sitemap
- [ ] LGPD
- [ ] Termos
- [ ] Política de privacidade
- [ ] Código de Conduta
- [ ] Segurança
- [ ] Moderação
- [ ] Testes críticos
- [ ] Mobile
- [ ] Performance
- [ ] Página de status/contato
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

# MVP — IMPLEMENTADO

O MVP foi implementado com sucesso. A estrutura base e os fluxos principais estão funcionando.

## Itens concluídos

- [x] Homepage com hero, busca global, estatísticas, destaques e CTA
- [x] Cadastro/login com sessão persistente
- [x] Perfil de desenvolvedor (página pública `/devs/username`)
- [x] Diretório de desenvolvedores (`/devs`) com filtros e paginação
- [x] Cadastro de projetos (`/projetos/novo`)
- [x] Diretório de projetos (`/projetos`) com filtros e ordenação
- [x] Página individual do projeto (`/projetos/[slug]`)
- [x] Stack/tags nos projetos e perfis
- [x] Busca global com autocomplete
- [x] GitHub e LinkedIn no perfil
- [x] Responsividade (mobile-first)
- [x] SEO básico (meta tags, URLs amigáveis)
- [x] Segurança básica (sanitização, validação)
- [x] LGPD básica (consentimento, dados mínimos)
- [x] Dashboard básico
- [x] Deploy (estrutura pronta para hospedagem estática)

## Estrutura implementada

```text
manausdev/
├── index.html
├── pages/
│   ├── devs/
│   │   ├── index.html
│   │   ├── [username].html
│   │   └── main.js
│   ├── projetos/
│   │   ├── index.html
│   │   ├── [slug].html
│   │   ├── novo.html
│   │   └── main.js
│   ├── empresas/
│   │   ├── index.html
│   │   └── main.js
│   ├── vagas/
│   │   ├── index.html
│   │   └── main.js
│   ├── eventos/
│   │   ├── index.html
│   │   └── main.js
│   ├── comunidades/
│   │   ├── index.html
│   │   └── main.js
│   └── auth/
│       ├── login.html
│       └── register.html
├── dashboard/
│   └── index.html
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
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
```

---

# Objetivo

A ManausDev não deve ser apenas mais uma rede social.

O objetivo é construir uma infraestrutura comunitária para descobrir:

> **quem está construindo tecnologia em Manaus, o que está sendo construído e como outras pessoas podem participar.**

**ManausDev — Feito em Manaus. Construído pela comunidade.**
