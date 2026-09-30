-- ==============================================================================
-- ManausDev — autoria de `community_channels` no INSERT
--
-- A policy de 20260929150000 abria a escrita por tipo de perfil, mas sem amarrar
-- `created_by` a `auth.uid()`. Isso permitia tres coisas ruins:
--
--   1. Um `dev` ou `empresa` inserir um canal com `created_by` de outra pessoa
--      (autoria falsificada).
--   2. Como UPDATE e DELETE usam `auth.uid() = created_by`, quem inseriu perdia
--      o controle do proprio registro, que passava para a pessoa indicada.
--   3. Um usuario que nao pode editar nada ainda conseguia criar linhas.
--
-- A correcao espelha a policy de `news`, que ja exige `auth.uid() = author_id`.
--
-- Efeito colateral aceito: `created_by` e `on delete set null`, entao ao excluir
-- um perfil o canal fica orfao e apenas admins conseguem editar ou remover --
-- o mesmo comportamento ja vigente em `news.author_id`.
-- ==============================================================================

drop policy if exists "Devs, empresas e admins podem criar canais"
  on public.community_channels;

create policy "Devs, empresas e admins podem criar canais" on public.community_channels
  for insert with check (
    auth.uid() = created_by
    and public.has_profile_type(array['dev', 'empresa', 'admin'])
  );
