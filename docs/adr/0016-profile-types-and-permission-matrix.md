# ADR 0016: Tipos de perfil e matriz de permissões por tipo de conta

**Status:** Aceito
**Data:** 2026-09-29
**Autor:** Equipe ManausDev

## Contexto

O schema tinha **um único conceito de identidade**, e ele era ambíguo:

```sql
role text default 'Developer',   -- cargo: 'Frontend Engineer', 'DevOps Engineer'
is_admin boolean default false,  -- único bit de autorização de todo o banco
```

Não existia `Role`, `UserType`, `Perfil` ou equivalente em lugar nenhum do repositório —
nem em TypeScript, nem no SQL. O `TODO.md:608-616` enumerava `user` / `moderator` /
`admin` como papéis de moderação, mas sem tipo, coluna, enum, policy ou UI corresponde.

O resultado eram três problemas:

1. **Toda escrita era liberada para qualquer autenticado.** As policies usavam
   `with check (auth.role() = 'authenticated')`. Um dev, uma empresa ou qualquer
   visitante logado podia publicar uma vaga em nome de outra empresa
   (`jobs.posted_by`) ou cadastrar uma empresa (`companies.created_by`).
2. **Editar e apagar não existiam.** Só havia INSERT. `projects`, `events`, `jobs` e
   `companies` eram append-only na prática — um autor que publicasse algo errado não
   tinha como corrigir, e `projects` usava `on delete cascade` sem caminho de remoção.
3. **`is_admin` não era escalável.** Um único boolean não representa
   "pessoa desenvolvedora" vs. "empresa que publica vagas" vs. "curadoria da
   plataforma", que são personas com obrigações diferentes no mesmo diretório.

Havia ainda um **buraco de escalada de privilégio**: a policy

```sql
create policy "Usuários podem editar seu próprio perfil" on public.profiles
  for update using (auth.uid() = id);
```

não tinha `with check`. Um usuário autenticado podia executar
`update profiles set is_admin = true where id = auth.uid()` e se tornar admin por
conta própria, já que `using` é satisfeito — a linha é dele.

## Decisão

### 1. `profile_type` como novo discriminador

`role` permanece como cargo textual, porque é exibido em três lugares da UI
(`src/app/devs/page.tsx:510`, `devs/[username]/dev-profile-client.tsx:196`,
`src/app/page.tsx:182`) e preenchido como `<input>` livre no dashboard. Colisão de
nome impossível de resolver sem quebrar os dois sentidos. O novo campo chama-se
`profile_type`:

```sql
profile_type text not null default 'dev'
  check (profile_type in ('dev', 'empresa', 'admin'))
```

Espelhado em `src/types/database.ts:9` como `export type ProfileType` e presente em
`Profile`, `Insert` e `Update`.

### 2. `is_admin` mantido, mas sem ser a única fonte de verdade

O helper `public.is_admin()` aceita `profile_type = 'admin' **ou** is_admin = true`.
O backfill (`update ... set profile_type = 'admin' where is_admin = true`) preserva
admins legados, e `is_admin` continua no schema para não quebrar consumidores
existentes. A coluna perde gradativamente a autoridade; o caminho para removê-la fica
aberto sem exigir uma migração breaking.

### 3. Helpers `security definer` para as policies

```sql
public.current_profile_type()  -- text: profile_type do auth.uid(), ou 'anon'
public.is_admin()               -- boolean
public.has_profile_type(allowed text[]) -- boolean
```

Todos `security definer set search_path = public`. O motivo não é cosmético: as
policies de `profiles` consultam `profile_type`, e com o `select using (true)`
público atual isso criaria recursão infinita. `security definer` quebra o ciclo.

### 4. Anti-escalação por trigger

```sql
public.guard_profile_privileges()  -- BEFORE UPDATE em profiles
```

Recusa a alteração de `profile_type` e de `is_admin` por quem não for admin, com
`errcode = '42501'` (insufficient_privilege). Preferido a `with check` na policy
porque o valor lido por uma função durante o check seria o da linha pré-update,
tornando a avaliação frágil e dependente de snapshot.

### 5. Matriz de permissões

| Recurso | dev | empresa | admin |
|---|:---:|:---:|:---:|
| `projects` | CRUD | leitura | CRUD |
| `events` | CRUD | CRUD | CRUD |
| `jobs` | — | CRUD | CRUD |
| `companies` | — | CRUD (próprio) | CRUD |
| `contacts` | — | — | leitura + triagem |
| `news` | CRUD | CRUD | CRUD |
| `community_channels` | CRUD | CRUD | CRUD |

Fonte única: `src/lib/profile-types.ts`. O SQL e o TypeScript citam o mesmo arquivo
nos cabeçalhos.

**`companies` é escopado por `created_by = auth.uid()`**, não liberado globalmente. A
formulação original era "empresa: CRUD de devs"; interpretá-la como permissão sobre a
tabela `profiles` daria a qualquer empresa o direito de reescrever a bio, o cargo e o
username de qualquer desenvolvedor da plataforma — escalada de privilégio. O que a
empresa administra é o próprio registro.

**`news` e `community_channels` não existem como tabelas.** Estão declarados na
matriz TypeScript e marcados como pendentes nos cabeçalhos SQL; a policy entra junto
com a criação das tabelas.

### 6. Escrita passa a exigir autoria

Todo `for insert` agora exige que a coluna de autoria aponte para `auth.uid()`:

```sql
with check (auth.uid() = author_id and public.has_profile_type(array['dev', 'admin']))
```

Substitui `auth.role() = 'authenticated'`, que verificava apenas que havia sessão.

## Consequências

- `tsc --noEmit`, `vitest run` (103 testes) e `next build` limpos após a mudança.
- Migração `20260929140000_profile_types.sql` aplicada via `supabase db push` no
  projeto linkado; os dois perfis existentes foram backfill para `dev` e a coluna foi
  confirmada via PostgREST (com controle negativo para descartar falso positivo).
- O `.upsert()` de `src/app/dashboard/page.tsx:132` não envia `profile_type`, então o
  `ON CONFLICT DO UPDATE` preserva o valor atual e o guard trigger não dispara —
  verificado por leitura do payload.
- Nenhuma rota ou componente lê `profile_type` ainda. A autorização é hoje
  exclusivamente do RLS; a UI de seleção de tipo entra junto com o onboarding.
- **Divergência deliberada:** a matriz de UI e a de RLS podem divergir. A de RLS é
  a que vale — a UI esconder um botão não substitui a policy.
- Mudança de tipo de perfil não é auto-serviço: exige um admin. Isso é intencional,
  mas significa que `profile_type` precisa de um caminho de curadoria (o painel
  administrativo do `TODO.md:879-894`) antes de ser útil.
- `public.current_profile_type()` não é referenciada por nenhuma policy ainda; existe
  como parte da API pública de autorização, junto de `is_admin()`.
