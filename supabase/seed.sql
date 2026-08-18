-- ==============================================================================
-- 🌿 ManausDev — Seed Data inicial para Supabase
-- ==============================================================================

-- Inserir Empresas
insert into public.companies (id, name, industry, location, size, website, logo_url) values
  ('c1111111-1111-1111-1111-111111111111', 'TechNorte', 'Software', 'Manaus-AM', '50-200', 'https://technorte.dev', null),
  ('c2222222-2222-2222-2222-222222222222', 'Amazônia Digital', 'E-commerce', 'Manaus-AM', '10-50', 'https://amazoniadigital.com.br', null),
  ('c3333333-3333-3333-3333-333333333333', 'RioApps', 'Mobile', 'Manaus-AM', '10-50', 'https://rioapps.tech', null),
  ('c4444444-4444-4444-4444-444444444444', 'Zodex', 'Marketplace', 'Manaus-AM', '10-50', 'https://zodex.com.br', null),
  ('c5555555-5555-5555-5555-555555555555', 'Sidia', 'P&D', 'Manaus-AM', '200-500', 'https://sidia.com', null),
  ('c6666666-6666-6666-6666-666666666666', 'Fucapi', 'P&D', 'Manaus-AM', '500-1000', 'https://fucapi.br', null)
on conflict (id) do nothing;

-- Inserir Comunidades
insert into public.communities (name, description, members_count, type, links) values
  ('Manaus Tech', 'Comunidade geral de tecnologia e inovação de Manaus.', 1200, 'tech', '{"discord": "https://discord.gg/manausdev", "meetup": "https://meetup.com/manaus-tech"}'::jsonb),
  ('Devs do Norte', 'Rede ampla de desenvolvedores de software da região Norte.', 850, 'tech', '{"telegram": "https://t.me/devsdonorte"}'::jsonb),
  ('Python Manaus', 'Grupo de entusiastas e profissionais de Python no Amazonas.', 420, 'tech', '{"github": "https://github.com/pythonmanaus"}'::jsonb),
  ('Frontend AM', 'Discussões sobre interfaces web, performance, acessibilidade e CSS.', 380, 'tech', '{"whatsapp": "https://chat.whatsapp.com"}'::jsonb),
  ('Mulheres na Tech AM', 'Incentivo, acolhimento e networking para mulheres na tecnologia.', 290, 'tech', '{"instagram": "https://instagram.com/mulheresnatech.am"}'::jsonb),
  ('AWS User Group Manaus', 'Comunidade oficial de usuários de Cloud Computing e AWS.', 210, 'tech', '{"meetup": "https://meetup.com/aws-manaus"}'::jsonb),
  ('Data Science AM', 'Ciência de dados, IA, analytics e machine learning na Amazônia.', 340, 'tech', '{"telegram": "https://t.me/datascienceam"}'::jsonb)
on conflict do nothing;

-- Inserir Eventos
insert into public.events (title, description, date, location, type, link) values
  ('ManausDev Meetup #12', 'Encontro presencial da comunidade para falar sobre Next.js, Cloud e Carreira.', '2026-09-15 19:00:00+00', 'Auditório da UFAM', 'meetup', 'https://meetup.com/manausdev'),
  ('Hackathon Amazônia Tech', 'Maratona de 48h de inovação para soluções bioeconômicas e sustentabilidade.', '2026-10-02 08:00:00+00', 'Online', 'hackathon', 'https://hackathon.manaus.dev'),
  ('Workshop de React Native', 'Construindo aplicativos modernos offline-first para o contexto amazônico.', '2026-08-28 14:00:00+00', 'Hub de Inovação', 'workshop', 'https://hub.manaus.dev/workshop'),
  ('Python Manaus Conf', 'A maior conferência de Python do Norte do Brasil.', '2026-11-10 09:00:00+00', 'Teatro Amazonas', 'conference', 'https://python.manaus.dev'),
  ('Cloud Day Manaus', 'Arquitetura de microsserviços, serverless e segurança em nuvem.', '2026-12-05 09:00:00+00', 'Centro de Convenções Vasco Vasques', 'conference', 'https://cloudday.manaus.dev'),
  ('Open Source Friday', 'Hackeando projetos open source locais com mentoria.', '2026-09-05 18:30:00+00', 'Coworking Manaus', 'meetup', 'https://meetup.com/manausdev-os')
on conflict do nothing;

-- Inserir Vagas
insert into public.jobs (title, description, company_id, company_name, type, remote, salary, location, skills, link) values
  ('Desenvolvedor Frontend Sênior', 'Buscamos especialista em React, Next.js e Tailwind para liderar squad.', 'c1111111-1111-1111-1111-111111111111', 'TechNorte', 'CLT', false, 'R$ 7.000 - R$ 10.000', 'Manaus-AM', array['React', 'Next.js', 'TypeScript', 'Tailwind'], 'https://technorte.dev/vagas/1'),
  ('Engenheiro de Software Backend', 'Construção de APIs de alta escala em Go e Node.js com PostgreSQL.', 'c2222222-2222-2222-2222-222222222222', 'Amazônia Digital', 'PJ', true, 'R$ 8.000 - R$ 12.000', 'Remoto (Manaus)', array['Node.js', 'Go', 'PostgreSQL', 'Docker'], 'https://amazoniadigital.com.br/carreiras'),
  ('Desenvolvedor Mobile React Native', 'Desenvolvimento de apps mobile para logística e e-commerce.', 'c3333333-3333-3333-3333-333333333333', 'RioApps', 'CLT', true, 'R$ 5.500 - R$ 8.000', 'Híbrido - Manaus', array['React Native', 'TypeScript', 'Firebase'], 'https://rioapps.tech/vagas'),
  ('DevOps / Cloud Engineer', 'Gerenciamento de clusters Kubernetes na AWS com Terraform.', 'c1111111-1111-1111-1111-111111111111', 'TechNorte', 'CLT', false, 'R$ 8.000 - R$ 11.000', 'Manaus-AM', array['AWS', 'Kubernetes', 'Terraform', 'CI/CD'], 'https://technorte.dev/vagas/2'),
  ('QA / Test Automation Engineer', 'Testes automatizados e2e com Playwright e Cypress.', 'c6666666-6666-6666-6666-666666666666', 'Fucapi', 'CLT', true, 'R$ 4.500 - R$ 6.500', 'Remoto', array['Playwright', 'Jest', 'Cypress', 'CI/CD'], 'https://fucapi.br/carreiras')
on conflict do nothing;
