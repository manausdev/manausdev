# ADR 0004: Autenticação stateless via localStorage com token JWT simulado

**Status:** Aceito  
**Data:** 2026-08-13  
**Autor:** Equipe ManausDev  

## Contexto

Precisamos de autenticação para proteger rotas privadas (dashboard, cadastro de projetos) sem backend real no MVP.

## Decisão

Implementar autenticação **stateless** usando:

- Token simulado em base64 armazenado em `localStorage` (`token`)
- Dados do usuário logado em `localStorage` (`currentUser`)
- `js/auth.js` com funções `login`, `register`, `logout`, `isAuthenticated`, `requireAuth`
- Proteção de rotas no frontend via redirect para `#login`

NÃO usar cookies, sessions ou backend de auth no MVP.

## Consequências

### Positivas
- Simples de implementar e entender
- Funciona em site estático puro
- Sessão persiste entre reloads
- Fácil migrar para JWT real no futuro

### Negativas
- Token não é validado server-side (não há server)
- XSS pode roubar o token
- Sem refresh token ou expiração real
- logout não invalida token remotely

## Alternativas consideradas

1. **Supabase Auth**: Excelente, mas exije integração com serviço externo. Melhor para pós-MVP.
2. **Cookies com sessions**: Exije backend. Descartado para MVP.
3. **OAuth2 via GitHub/Google**: Adiciona complexidade de configuração. Pode ser adicionado depois.

## Referências

- `js/auth.js` - Lógica de autenticação
- `pages/auth/login.html` - Página de login
- `pages/auth/register.html` - Página de cadastro
- `TODO.md` - Seção "6. Autenticação"
