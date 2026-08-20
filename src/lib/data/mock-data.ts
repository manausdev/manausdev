import type { Profile, Project, Company, Community, EventItem, Job } from '@/types/database';

export const MOCK_DEVS: Profile[] = [
  { id: '1', username: 'anasilva', full_name: 'Ana Silva', email: 'ana.silva@example.com', role: 'Frontend Engineer', skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'], location: 'Manaus-AM', bio: 'Apaixonada por interfaces acessíveis e performance web no coração da Amazônia.', github: 'https://github.com/anasilva', available: true, is_admin: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', username: 'brunocosta', full_name: 'Bruno Costa', email: 'bruno.costa@example.com', role: 'Backend Developer', skills: ['Node.js', 'Go', 'Redis', 'PostgreSQL'], location: 'Manaus-AM', bio: 'Arquitetura de microsserviços e sistemas distribuídos de alta vazão.', github: 'https://github.com/brunocosta', available: true, is_admin: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', username: 'carloslima', full_name: 'Carlos Lima', email: 'carlos.lima@example.com', role: 'Fullstack Developer', skills: ['Python', 'Django', 'AWS', 'React'], location: 'Manaus-AM', bio: 'Desenvolvedor fullstack com foco em soluções cloud e bioeconomia.', github: 'https://github.com/carloslima', available: false, is_admin: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', username: 'fernandaoliveira', full_name: 'Fernanda Oliveira', email: 'fernanda.oliveira@example.com', role: 'Mobile Developer', skills: ['React Native', 'Flutter', 'Firebase'], location: 'Manaus-AM', bio: 'Apps mobile performáticos e soluções offline-first para o interior do AM.', github: 'https://github.com/fernandaoliveira', available: true, is_admin: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', username: 'gabrielsantos', full_name: 'Gabriel Santos', email: 'gabriel.santos@example.com', role: 'DevOps Engineer', skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'], location: 'Manaus-AM', bio: 'CI/CD, infraestrutura como código e observabilidade.', github: 'https://github.com/gabrielsantos', available: true, is_admin: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', username: 'julianapereira', full_name: 'Juliana Pereira', email: 'juliana.pereira@example.com', role: 'Data Engineer', skills: ['Python', 'Spark', 'SQL', 'GCP'], location: 'Manaus-AM', bio: 'Pipelines de dados e analytics para preservação florestal e indústria 4.0.', github: 'https://github.com/julianapereira', available: false, is_admin: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '7', username: 'rafaelnascimento', full_name: 'Rafael Nascimento', email: 'rafael.nascimento@example.com', role: 'Fullstack Developer', skills: ['Next.js', 'Supabase', 'TypeScript', 'Node.js'], location: 'Manaus-AM', bio: 'Criando produtos digitais escaláveis e open-source para a comunidade amazonense.', github: 'https://github.com/rafaelnascimento', available: true, is_admin: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'ManausHub',
    description: 'Plataforma de conexão e fomento do ecossistema de profissionais e comunidades de tecnologia do Amazonas.',
    stack: ['Next.js', 'Supabase', 'Tailwind', 'TypeScript'],
    links: { github: 'https://github.com/manausdev/manaus-hub', demo: 'https://manaushub.dev' },
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'RioTech Maps',
    description: 'Mapa interativo e colaborativo mapeando polos, polos de inovação e startups de Manaus.',
    stack: ['Next.js', 'Mapbox', 'PostgreSQL'],
    links: { github: 'https://github.com/manausdev/riotech-maps' },
    image_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Amazônia Tur Tech',
    description: 'Guia turístico inteligente e offline para exploração ecológica nos rios Negro e Solimões.',
    stack: ['React Native', 'Supabase', 'Expo'],
    links: { github: 'https://github.com/manausdev/amazonia-tur' },
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'GreenCheck IoT',
    description: 'Sistema de monitoramento e telemetria de sensores ambientais instalados na floresta amazônica.',
    stack: ['Python', 'MQTT', 'TimescaleDB', 'Next.js'],
    links: { github: 'https://github.com/manausdev/greencheck' },
    image_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_COMPANIES: Company[] = [
  { 
    id: '1', 
    name: 'TechNorte', 
    industry: 'Software & Cloud', 
    location: 'Manaus-AM', 
    size: '50-200', 
    website: 'https://technorte.dev', 
    description: 'Desenvolvimento ágil de software e modernização cloud para o Polo Industrial de Manaus.', 
    logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
  { 
    id: '2', 
    name: 'Amazônia Digital', 
    industry: 'E-commerce & Logística', 
    location: 'Manaus-AM', 
    size: '10-50', 
    website: 'https://amazoniadigital.com.br', 
    description: 'Soluções logísticas e de e-commerce conectando o Norte ao resto do país.', 
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
  { 
    id: '3', 
    name: 'RioApps', 
    industry: 'Mobile Solutions', 
    location: 'Manaus-AM', 
    size: '10-50', 
    website: 'https://rioapps.tech', 
    description: 'Aplicativos corporativos e mobile experience de alto padrão para marcas da Amazônia.', 
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
  { 
    id: '4', 
    name: 'Sidia Instituto de Ciência e Tecnologia', 
    industry: 'P&D e Inovação', 
    location: 'Manaus-AM', 
    size: '500+', 
    website: 'https://sidia.com', 
    description: 'Um dos maiores institutos de pesquisa e inovação tecnológica da América Latina.', 
    logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
];

export const MOCK_COMMUNITIES: Community[] = [
  { 
    id: '1', 
    name: 'Manaus Tech Hub', 
    description: 'A maior comunidade aberta de tecnologia, inovação e startups de Manaus.', 
    members_count: 1250, 
    type: 'Geral', 
    links: { discord: 'https://discord.gg/manausdev' }, 
    image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
  { 
    id: '2', 
    name: 'Devs do Norte', 
    description: 'Rede de desenvolvedores de software conectando talentos de toda a Amazônia.', 
    members_count: 890, 
    type: 'Desenvolvimento', 
    links: { telegram: 'https://t.me/devsdonorte' }, 
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
  { 
    id: '3', 
    name: 'Python Manaus', 
    description: 'Encontros, palestras e hackathons em torno do ecossistema Python no Amazonas.', 
    members_count: 430, 
    type: 'Linguagem', 
    links: { github: 'https://github.com/pythonmanaus' }, 
    image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
  { 
    id: '4', 
    name: 'Mulheres na Tech AM', 
    description: 'Comunidade dedicada ao protagonismo feminino e capacitação técnica no estado.', 
    members_count: 310, 
    type: 'Diversidade', 
    links: { instagram: 'https://instagram.com/mulheresnatech.am' }, 
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
];

export const MOCK_EVENTS: EventItem[] = [
  { 
    id: '1', 
    title: 'ManausDev Meetup #12 — Next.js & Supabase', 
    description: 'Imersão presencial sobre arquiteturas modernas fullstack, banco vetorial e deployment regional.', 
    date: '2026-09-15T19:00:00Z', 
    location: 'Auditório da UFAM — Manaus', 
    type: 'meetup', 
    link: 'https://meetup.com/manausdev', 
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
  { 
    id: '2', 
    title: 'Hackathon Amazônia Tech 2026', 
    description: '48 horas construindo soluções tecnológicas sustentáveis e de bioeconomia amazônica.', 
    date: '2026-10-02T08:00:00Z', 
    location: 'Online & Hub de Inovação', 
    type: 'hackathon', 
    link: 'https://hackathon.manaus.dev', 
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
  { 
    id: '3', 
    title: 'Python Manaus Conf 2026', 
    description: 'Conferência regional trazendo palestrantes nacionais sobre IA, Django e dados.', 
    date: '2026-11-10T09:00:00Z', 
    location: 'Teatro Amazonas / Centro', 
    type: 'conference', 
    link: 'https://python.manaus.dev', 
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString() 
  },
];

export const MOCK_JOBS: Job[] = [
  { id: '1', title: 'Desenvolvedor Frontend Sênior (Next.js)', company_name: 'TechNorte', type: 'CLT', remote: false, salary: 'R$ 7.500 - R$ 11.000', location: 'Manaus-AM', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'], description: 'Liderar desenvolvimento frontend de novas plataformas cloud com foco em UX excepcional.', link: 'https://technorte.dev/vagas', created_at: new Date().toISOString() },
  { id: '2', title: 'Engenheiro Backend Go / PostgreSQL', company_name: 'Amazônia Digital', type: 'PJ', remote: true, salary: 'R$ 8.000 - R$ 13.000', location: 'Remoto (AM)', skills: ['Go', 'PostgreSQL', 'Docker', 'Redis'], description: 'Arquitetura de microsserviços de alto rendimento para infraestrutura e pagamentos.', link: 'https://amazoniadigital.com.br/vagas', created_at: new Date().toISOString() },
  { id: '3', title: 'Desenvolvedor Mobile React Native', company_name: 'RioApps', type: 'CLT', remote: true, salary: 'R$ 5.500 - R$ 8.500', location: 'Híbrido - Adrianópolis', skills: ['React Native', 'TypeScript', 'Offline-First'], description: 'Construir experiências mobile modernas e fluidas para os maiores clientes do Norte.', link: 'https://rioapps.tech/vagas', created_at: new Date().toISOString() },
];
