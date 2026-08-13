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

- [ ] Criar organização `ManausDev`
- [ ] Criar repositório `.github`
- [ ] Criar `.github/profile/README.md`
- [ ] Adicionar descrição da organização
- [ ] Adicionar site oficial
- [ ] Adicionar localização
- [ ] Configurar avatar/logo
- [ ] Configurar redes sociais
- [ ] Configurar Discussions
- [ ] Definir membros públicos da organização

## Repositório principal

- [ ] Criar `ManausDev/manausdev`
- [ ] Criar `README.md`
- [ ] Criar `TODO.md`
- [ ] Criar `CONTRIBUTING.md`
- [ ] Criar `CODE_OF_CONDUCT.md`
- [ ] Criar `SECURITY.md`
- [ ] Criar `LICENSE`
- [ ] Criar `.gitignore`
- [ ] Criar templates de Issues
- [ ] Criar template de Pull Request
- [ ] Configurar labels
- [ ] Configurar branch protection
- [ ] Configurar Dependabot
- [ ] Configurar GitHub Actions

---

# 2. Identidade visual

- [ ] Criar logo ManausDev
- [ ] Criar versão horizontal
- [ ] Criar versão reduzida
- [ ] Criar favicon
- [ ] Definir tipografia
- [ ] Definir paleta
- [ ] Definir identidade visual
- [ ] Definir Design System
- [ ] Criar componentes básicos
- [ ] Definir padrões de espaçamento
- [ ] Definir breakpoints
- [ ] Definir modo claro
- [ ] Definir modo escuro
- [ ] Criar Open Graph image
- [ ] Criar identidade do selo "Feito em Manaus"

---

# 3. Arquitetura

## Frontend

Inicialmente:

```text
HTML
CSS
JavaScript
```

- [ ] Definir arquitetura do frontend
- [ ] Separar páginas
- [ ] Separar componentes
- [ ] Separar estilos
- [ ] Criar módulos JavaScript
- [ ] Criar cliente da API
- [ ] Criar gerenciamento de estado simples
- [ ] Criar tratamento global de erros
- [ ] Criar sistema de configuração por ambiente

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

- [ ] Escolher backend
- [ ] Definir API
- [ ] Definir banco de dados
- [ ] Definir autenticação
- [ ] Definir armazenamento de arquivos
- [ ] Criar ambientes development/staging/production
- [ ] Configurar variáveis de ambiente
- [ ] Configurar migrations
- [ ] Configurar seeds
- [ ] Implementar logs
- [ ] Implementar rate limiting
- [ ] Implementar validação
- [ ] Implementar tratamento de erros
- [ ] Implementar autorização

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

- [ ] `users`
- [ ] `developers`
- [ ] `skills`
- [ ] `developer_skills`
- [ ] `projects`
- [ ] `project_members`
- [ ] `companies`
- [ ] `jobs`
- [ ] `team_requests`
- [ ] `events`
- [ ] `communities`
- [ ] `articles`
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

## Projeto

```text
id
owner_id
name
slug
description
repository_url
demo_url
website_url
image
status
open_source
looking_for_members
created_at
updated_at
```

## Empresa

```text
id
name
slug
description
logo
website
linkedin
github
type
verified
created_at
```

## Vaga

```text
id
company_id
title
description
level
employment_type
work_mode
location
application_url
expires_at
created_at
```

---

# 6. Autenticação

- [ ] Cadastro
- [ ] Login
- [ ] Logout
- [ ] Recuperação de senha
- [ ] Confirmação de e-mail
- [ ] Login com GitHub
- [ ] Login com Google
- [ ] Sessão persistente
- [ ] Proteção de páginas privadas
- [ ] Exclusão de conta
- [ ] Exportação dos dados pessoais

---

# 7. Perfil de desenvolvedor

## Página pública

- [ ] Nome
- [ ] Username
- [ ] Avatar
- [ ] Bio
- [ ] Cargo/área
- [ ] Senioridade
- [ ] Stack
- [ ] GitHub
- [ ] LinkedIn
- [ ] Site
- [ ] Projetos
- [ ] Open Source
- [ ] Comunidades
- [ ] Disponibilidade profissional
- [ ] Disponibilidade para projetos

URL:

```text
/devs/username
```

## Edição

- [ ] Editar informações
- [ ] Editar avatar
- [ ] Adicionar tecnologias
- [ ] Adicionar redes
- [ ] Configurar disponibilidade
- [ ] Configurar privacidade

---

# 8. Diretório de desenvolvedores

- [ ] Página `/devs`
- [ ] Cards
- [ ] Paginação
- [ ] Busca por nome
- [ ] Busca por tecnologia
- [ ] Filtro por área
- [ ] Filtro por senioridade
- [ ] Filtro por disponibilidade
- [ ] Ordenação
- [ ] URL compartilhável dos filtros

Exemplo:

```text
/devs?stack=rust
/devs?stack=python
/devs?stack=react&available=true
```

---

# 9. Projetos

- [ ] Página `/projetos`
- [ ] Cadastro de projeto
- [ ] Edição
- [ ] Exclusão
- [ ] Página individual
- [ ] Nome
- [ ] Descrição
- [ ] Screenshots
- [ ] Stack
- [ ] Repositório
- [ ] Demo
- [ ] Site
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

- [ ] Hero
- [ ] Busca global
- [ ] Estatísticas
- [ ] Projetos em destaque
- [ ] Desenvolvedores
- [ ] Vagas recentes
- [ ] Próximos eventos
- [ ] Comunidades
- [ ] Empresas
- [ ] Conteúdo recente
- [ ] CTA para cadastro

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
- [ ] Editar perfil
- [ ] Meus projetos
- [ ] Minhas vagas
- [ ] Meus anúncios
- [ ] Eventos
- [ ] Favoritos
- [ ] Configurações
- [ ] Conta
- [ ] Privacidade

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

- [ ] URLs amigáveis
- [ ] `<title>`
- [ ] Meta description
- [ ] Canonical
- [ ] Open Graph
- [ ] Twitter/X Cards
- [ ] Sitemap
- [ ] Robots.txt
- [ ] Structured Data
- [ ] Schema.org Person
- [ ] Schema.org Organization
- [ ] Schema.org JobPosting
- [ ] Schema.org Event
- [ ] Schema.org Article

---

# 25. Acessibilidade

Meta inicial: WCAG 2.2 AA.

- [ ] HTML semântico
- [ ] Navegação por teclado
- [ ] Focus states
- [ ] Labels
- [ ] ARIA somente quando necessário
- [ ] Contraste adequado
- [ ] Alt text
- [ ] Skip navigation
- [ ] Formulários acessíveis
- [ ] Testar leitores de tela
- [ ] Respeitar `prefers-reduced-motion`

---

# 26. Responsividade

Testar:

- [ ] Desktop
- [ ] Notebook
- [ ] Tablet
- [ ] Smartphone

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

# MVP

O MVP não precisa implementar todo este TODO.

A primeira versão deve priorizar:

- [ ] Homepage
- [ ] Cadastro/login
- [ ] Perfil de desenvolvedor
- [ ] Diretório de desenvolvedores
- [ ] Cadastro de projetos
- [ ] Diretório de projetos
- [ ] Página individual do projeto
- [ ] Stack/tags
- [ ] Busca
- [ ] GitHub e LinkedIn no perfil
- [ ] Responsividade
- [ ] SEO básico
- [ ] Segurança básica
- [ ] LGPD básica
- [ ] Painel mínimo de moderação
- [ ] Deploy

Fluxo principal:

```text
Entrar na ManausDev
        |
        v
Descobrir desenvolvedores
        |
        +------> Ver perfil
        |
        v
Descobrir projetos
        |
        +------> GitHub / Demo
        |
        v
Criar conta
        |
        v
Criar perfil
        |
        v
Publicar projeto
```

Quando esse fluxo estiver funcionando bem, começar a adicionar:

```text
Empresas
   ↓
Vagas
   ↓
Comunidades
   ↓
Eventos
   ↓
Procuro equipe
   ↓
Conteúdo
   ↓
Destaques
   ↓
API / Open Data
```

---

# Objetivo

A ManausDev não deve ser apenas mais uma rede social.

O objetivo é construir uma infraestrutura comunitária para descobrir:

> **quem está construindo tecnologia em Manaus, o que está sendo construído e como outras pessoas podem participar.**

**ManausDev — Feito em Manaus. Construído pela comunidade.**
