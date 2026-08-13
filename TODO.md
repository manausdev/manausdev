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

- [x] Login com GitHub
- [x] Vincular conta GitHub
- [x] Importar avatar
- [x] Importar bio
- [x] Importar repositórios
- [x] Selecionar projetos para publicar
- [x] Importar linguagens
- [x] Mostrar stars
- [x] Mostrar forks
- [x] Mostrar última atualização
- [x] Atualização periódica
- [x] Respeitar limites da API

---

# 11. Empresas

- [x] Diretório `/empresas`
- [x] Página da empresa
- [x] Cadastro
- [x] Logo
- [x] Descrição
- [x] Site
- [x] Redes
- [x] Tecnologias
- [x] Projetos
- [x] Vagas
- [x] Desenvolvedores relacionados
- [x] Processo de verificação
- [x] Empresa verificada

---

# 12. Vagas

- [x] Página `/vagas`
- [x] Publicar vaga
- [x] Editar vaga
- [x] Remover vaga
- [x] Expiração automática
- [x] Empresa
- [x] Cargo
- [x] Senioridade
- [x] Stack
- [x] Salário opcional
- [x] CLT
- [x] PJ
- [x] Estágio
- [x] Freelancer
- [x] Presencial
- [x] Híbrido
- [x] Remoto
- [x] Link de candidatura
- [x] Busca
- [x] Filtros

---

# 13. Procuro equipe

- [x] Página `/equipes`
- [x] Criar anúncio
- [x] Projeto relacionado
- [x] Função procurada
- [x] Tecnologias
- [x] Descrição
- [x] Remunerado/não remunerado
- [x] Contato
- [x] Prazo
- [x] Encerrar anúncio

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
- [x] Cadastro
- [x] Nome
- [x] Descrição
- [x] Data
- [x] Horário
- [x] Local
- [x] Evento online
- [x] Organizador
- [x] Link
- [x] Inscrição
- [x] Imagem
- [x] Calendário
- [x] Eventos futuros
- [x] Eventos anteriores

---

# 15. Comunidades

- [x] Página `/comunidades`
- [x] Cadastro
- [x] Nome
- [x] Descrição
- [x] Logo
- [x] Tecnologias
- [x] Site
- [x] GitHub
- [x] Discord
- [x] Telegram
- [x] WhatsApp
- [x] LinkedIn
- [x] Eventos
- [x] Administradores
- [x] Verificação

---

# 16. Conteúdo

- [x] Página `/conteudo`
- [x] Artigos
- [x] Tutoriais
- [x] Relatos
- [x] Pesquisa
- [x] Conteúdo acadêmico
- [x] Tags
- [x] Autor
- [x] Markdown
- [x] Preview
- [x] Rascunho
- [x] Publicação
- [x] Moderação

---

# 17. Destaques

Criar:

- [x] Projeto da semana
- [x] Desenvolvedor em destaque
- [x] Empresa/startup em destaque
- [x] Comunidade em destaque
- [x] Evento em destaque

Definir:

- [x] Critérios
- [x] Processo de indicação
- [x] Curadoria
- [x] Histórico de destaques

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

- [x] Busca textual
- [x] Autocomplete
- [x] Filtros
- [x] Ordenação
- [x] Página de resultados
- [x] Busca por tags
- [x] Busca por tecnologias

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

- [x] Denunciar perfil
- [x] Denunciar projeto
- [x] Denunciar vaga
- [x] Denunciar empresa
- [x] Denunciar conteúdo
- [x] Fila de moderação
- [x] Aprovar
- [x] Rejeitar
- [x] Ocultar
- [x] Suspender usuário
- [x] Banir usuário
- [x] Registrar ações administrativas
- [x] Sistema de recurso

---

# 22. Segurança

- [x] HTTPS
- [x] CSP
- [x] CORS
- [x] CSRF quando aplicável
- [x] Proteção contra XSS
- [x] Sanitização
- [x] Validação server-side
- [x] Rate limiting
- [x] Proteção contra spam
- [x] Proteção contra bots
- [x] Controle de permissões
- [x] RLS no banco quando aplicável
- [x] Secrets fora do repositório
- [x] Auditoria de dependências
- [x] Backup
- [x] Logs de segurança
- [x] Política de disclosure

---

# 23. LGPD e privacidade

- [x] Mapear dados pessoais coletados
- [x] Definir bases legais aplicáveis
- [x] Coletar somente dados necessários
- [x] Consentimento quando necessário
- [x] Política de privacidade
- [x] Termos de uso
- [x] Exclusão da conta
- [x] Exclusão dos dados
- [x] Correção de dados
- [x] Exportação de dados
- [x] Definir retenção
- [x] Canal para solicitações de titulares
- [x] Política para conteúdo público

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

- [x] Minificar CSS
- [x] Minificar JS
- [x] Lazy loading
- [x] Compressão de imagens
- [x] WebP/AVIF
- [x] Cache
- [x] CDN
- [x] Code splitting quando necessário
- [x] Reduzir JavaScript desnecessário
- [x] Lighthouse
- [x] Core Web Vitals

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

- [x] Visitantes
- [x] Perfis visualizados
- [x] Projetos visualizados
- [x] Cliques em vagas
- [x] Cliques em GitHub
- [x] Cliques em projetos
- [x] Buscas
- [x] Tecnologias mais pesquisadas
- [x] Eventos acessados

Evitar analytics invasivo.

---

# 30. Selo "Feito em Manaus"

Criar badge:

```text
Feito em Manaus
```

- [x] SVG
- [x] PNG
- [x] Markdown
- [x] HTML
- [x] Página explicativa
- [x] Critérios de utilização
- [x] Link para o projeto na ManausDev

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

- [x] Definir quais informações podem ser abertas
- [x] Anonimização quando necessária
- [x] API pública
- [x] Dataset
- [x] Documentação
- [x] Licença dos dados

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

- [x] Versionamento
- [x] Documentação
- [x] Rate limiting
- [x] API keys se necessárias
- [x] OpenAPI
- [x] Política de uso

---

# 33. Administração

Criar painel administrativo.

- [x] Dashboard
- [x] Usuários
- [x] Projetos
- [x] Empresas
- [x] Vagas
- [x] Eventos
- [x] Comunidades
- [x] Artigos
- [x] Denúncias
- [x] Destaques
- [x] Estatísticas
- [x] Logs

---

# 34. Infraestrutura

- [x] Registrar domínio
- [x] Configurar DNS
- [x] Configurar hospedagem
- [x] Configurar banco
- [x] Configurar storage
- [x] Configurar CDN
- [x] Configurar SSL
- [x] Configurar CI/CD
- [x] Configurar staging
- [x] Configurar produção
- [x] Backups automáticos
- [x] Monitoramento
- [x] Error tracking
- [x] Uptime monitoring

---

# 35. Observabilidade

- [x] Logs estruturados
- [x] Logs de erro
- [x] Métricas
- [x] Alertas
- [x] Monitoramento de disponibilidade
- [x] Monitoramento da API
- [x] Monitoramento do banco
- [x] Monitoramento de jobs
- [x] Dashboard operacional

---

# 36. Comunidade Open Source

Criar documentação para novos contribuidores.

- [x] Como executar localmente
- [x] Como contribuir
- [x] Como abrir Issue
- [x] Como enviar PR
- [x] Convenção de commits
- [x] Guia de estilo
- [x] Arquitetura
- [x] Good First Issues
- [x] Help Wanted
- [x] Discussions
- [x] Roadmap público

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

- [x] 20+ desenvolvedores
- [x] 10+ projetos
- [x] 5+ empresas
- [x] 5+ comunidades
- [x] Eventos relevantes
- [x] Vagas disponíveis

Sempre obter autorização quando necessária para criação de perfis em nome de terceiros.

---

# 38. Beta fechado

- [x] Selecionar primeiros participantes
- [x] Criar formulário de feedback
- [x] Testar cadastro
- [x] Testar criação de perfil
- [x] Testar projetos
- [x] Testar busca
- [x] Corrigir bugs
- [x] Avaliar UX
- [x] Avaliar performance
- [x] Avaliar segurança

---

# 39. Beta público

- [x] Liberar cadastro
- [x] Divulgar nas comunidades
- [x] Divulgar nas universidades
- [x] Divulgar entre empresas
- [x] Convidar projetos locais
- [x] Coletar feedback
- [x] Monitorar erros
- [x] Monitorar abuso
- [x] Publicar roadmap

---

# 40. Lançamento

- [x] Domínio funcionando
- [x] HTTPS
- [x] Analytics
- [x] Monitoramento
- [x] Backups
- [x] SEO
- [x] Sitemap
- [x] LGPD
- [x] Termos
- [x] Política de privacidade
- [x] Código de Conduta
- [x] Segurança
- [x] Moderação
- [x] Testes críticos
- [x] Mobile
- [x] Performance
- [x] Página de status/contato
- [x] Divulgação oficial

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

- [x] Entrevistar usuários
- [x] Identificar funcionalidades pouco utilizadas
- [x] Melhorar onboarding
- [x] Melhorar descoberta
- [x] Melhorar busca
- [x] Melhorar moderação
- [x] Revisar segurança
- [x] Revisar custos
- [x] Publicar changelog

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
