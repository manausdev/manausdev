import type {
  Project,
  EventItem,
  Company,
  Community,
  CommunityChannel,
  Job,
  NewsItem,
} from '@/types/database';

export const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'TechNorte',
    industry: 'Software & Cloud',
    location: 'Manaus-AM',
    size: '50-200',
    website: 'https://technorte.dev',
    description:
      'Desenvolvimento ágil de software e modernização cloud para o Polo Industrial de Manaus.',
    logo_url:
      'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=160&q=80',
    image_url:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Amazônia Digital',
    industry: 'E-commerce & Logística',
    location: 'Manaus-AM',
    size: '10-50',
    website: 'https://amazoniadigital.com.br',
    description: 'Soluções logísticas e de e-commerce conectando o Norte ao resto do país.',
    logo_url:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80',
    image_url:
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'RioApps',
    industry: 'Mobile Solutions',
    location: 'Manaus-AM',
    size: '10-50',
    website: 'https://rioapps.tech',
    description:
      'Aplicativos corporativos e mobile experience de alto padrão para marcas da Amazônia.',
    logo_url:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80',
    image_url:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Sidia Instituto de Ciência e Tecnologia',
    industry: 'P&D e Inovação',
    location: 'Manaus-AM',
    size: '500+',
    website: 'https://sidia.com',
    description: 'Um dos maiores institutos de pesquisa e inovação tecnológica da América Latina.',
    logo_url:
      'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=160&q=80',
    image_url:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: '1',
    name: 'Manaus Tech Hub',
    description:
      'A maior comunidade aberta de tecnologia, inovação e startups de Manaus.',
    members_count: 1250,
    type: 'Geral',
    links: { discord: 'https://discord.gg/manausdev' },
    image_url:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Devs do Norte',
    description:
      'Rede de desenvolvedores de software conectando talentos de toda a Amazônia.',
    members_count: 890,
    type: 'Desenvolvimento',
    links: { telegram: 'https://t.me/devsdonorte' },
    image_url:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Python Manaus',
    description:
      'Encontros, palestras e hackathons em torno do ecossistema Python no Amazonas.',
    members_count: 430,
    type: 'Linguagem',
    links: { github: 'https://github.com/pythonmanaus' },
    image_url:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Mulheres na Tech AM',
    description:
      'Comunidade dedicada ao protagonismo feminino e capacitação técnica no estado.',
    members_count: 310,
    type: 'Diversidade',
    links: { instagram: 'https://instagram.com/mulheresnatech.am' },
    image_url:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Desenvolvedor Frontend Sênior (Next.js)',
    company_name: 'TechNorte',
    type: 'CLT',
    remote: false,
    salary: 'R$ 7.500 - R$ 11.000',
    location: 'Manaus-AM',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    description:
      'Liderar desenvolvimento frontend de novas plataformas cloud com foco em UX excepcional.',
    link: 'https://technorte.dev/vagas',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Engenheiro Backend Go / PostgreSQL',
    company_name: 'Amazônia Digital',
    type: 'PJ',
    remote: true,
    salary: 'R$ 8.000 - R$ 13.000',
    location: 'Remoto (AM)',
    skills: ['Go', 'PostgreSQL', 'Docker', 'Redis'],
    description:
      'Arquitetura de microsserviços de alto rendimento para infraestrutura e pagamentos.',
    link: 'https://amazoniadigital.com.br/vagas',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Desenvolvedor Mobile React Native',
    company_name: 'RioApps',
    type: 'CLT',
    remote: true,
    salary: 'R$ 5.500 - R$ 8.500',
    location: 'Híbrido - Adrianópolis',
    skills: ['React Native', 'TypeScript', 'Offline-First'],
    description:
      'Construir experiências mobile modernas e fluidas para os maiores clientes do Norte.',
    link: 'https://rioapps.tech/vagas',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Amazônia Monitor',
    description: 'Dashboard de monitoramento de desmatamento em tempo real usando dados de satélite.',
    stack: ['React', 'Mapbox', 'Python', 'PostGIS'],
    author_id: '1',
    created_at: '2025-06-10T10:00:00.000Z',
    updated_at: '2025-06-10T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Rio Negro API',
    description: 'API pública de dados hidrológicos do Rio Negro com cache inteligente.',
    stack: ['Go', 'Redis', 'PostgreSQL', 'Docker'],
    author_id: '2',
    created_at: '2025-05-22T14:30:00.000Z',
    updated_at: '2025-05-22T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Bioeconomia Connect',
    description: 'Marketplace conectando produtores da bioeconomia amazônica a compradores globais.',
    stack: ['Next.js', 'Supabase', 'Stripe', 'Tailwind'],
    author_id: '3',
    created_at: '2025-08-01T09:15:00.000Z',
    updated_at: '2025-08-01T09:15:00.000Z',
  },
  {
    id: '4',
    title: 'Trilhas da Floresta',
    description: 'App mobile para navegação e segurança em trilhas na Amazônia.',
    stack: ['React Native', 'Expo', 'Firebase', 'Mapbox'],
    author_id: '4',
    created_at: '2025-07-18T11:00:00.000Z',
    updated_at: '2025-07-18T11:00:00.000Z',
  },
  {
    id: '5',
    title: 'Infra-as-Code Amazônia',
    description: 'Módulos Terraform reutilizáveis para infraestrutura na AWS na região sa-east-1.',
    stack: ['Terraform', 'AWS', 'GitHub Actions', 'Go'],
    author_id: '5',
    created_at: '2025-04-30T16:45:00.000Z',
    updated_at: '2025-04-30T16:45:00.000Z',
  },
  {
    id: '6',
    title: 'Guardian Data Pipeline',
    description: 'Pipeline de dados para alertas de queimadas e desmatamento em tempo quase real.',
    stack: ['Python', 'Apache Beam', 'BigQuery', 'Looker'],
    author_id: '6',
    created_at: '2025-09-01T08:00:00.000Z',
    updated_at: '2025-09-01T08:00:00.000Z',
  },
  {
    id: '7',
    title: 'ManausDev Platform',
    description: 'A própria plataforma da comunidade - diretório, projetos, vagas e eventos.',
    stack: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind'],
    author_id: '7',
    created_at: '2026-02-14T12:00:00.000Z',
    updated_at: '2026-02-14T12:00:00.000Z',
  },
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Amazônia Tech Summit 2025',
    description: 'O maior evento de tecnologia da Amazônia, reunindo devs, pesquisadores e empreendedores.',
    date: '2025-10-15',
    location: 'Manaus - Centro de Convenções',
    organizer_id: '7',
created_at: '2025-08-01T12:00:00.000Z',
},
{
  id: '2',
  title: 'Workshop: React Native para Apps Offline-First',
  description: 'Hands-on criando apps que funcionam sem conexão na floresta.',
  date: '2025-11-20',
  location: 'Manaus - Impact Hub',
  organizer_id: '4',
  created_at: '2025-09-10T10:00:00.000Z',
},
{
  id: '3',
  title: 'Meetup: Bioeconomia e Dados Abertos',
  description: 'Como dados abertos podem impulsionar a bioeconomia amazônica.',
  date: '2025-12-05',
  location: 'Online / Presencial',
  organizer_id: '6',
  created_at: '2025-09-15T14:00:00.000Z',
},
{
  id: '4',
  title: 'Hackathon Amazônia Sustentável',
  description: '48h criando soluções tech para desafios ambientais da região.',
  date: '2026-02-28',
  location: 'Manaus - UEA',
  organizer_id: '1',
  created_at: '2025-11-01T10:00:00.000Z',
},
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'ManausDev Meetup #12 reúne a comunidade em torno de Next.js e Supabase',
    excerpt:
      'Imersão presencial sobre arquiteturas fullstack modernas, banco vetorial e deployment regional na UFAM.',
    content:
      'A doze edição do meetup do ManausDev acontece no Auditório da UFAM e reúne desenvolvedores de toda a região para uma imersão em arquiteturas fullstack modernas. A talk de abertura cobre Next.js com App Router e Supabase em produção, incluindo o custo real de operar na Amazônia: latência, regiões e caching.\n\nO encontro é aberto a toda a comunidade e termina com uma sessão de mentoria coletiva entre participantes.',
    image_url:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    category: 'evento',
    published: true,
    published_at: '2026-09-15T19:00:00Z',
    author_id: '7',
    created_at: '2026-09-10T12:00:00.000Z',
    updated_at: '2026-09-15T19:00:00.000Z',
  },
  {
    id: '2',
    title: 'Hackathon Amazônia Tech abre inscrições para 48 horas de construção',
    excerpt:
      'Times de até cinco pessoas competem por soluções sustentável e de bioeconomia amazônica.',
    content:
      'O Hackathon Amazônia Tech 2026 abre inscrições para times de até cinco pessoas. A proposta é construir, em 48 horas, soluções tecnológicas voltadas à sustentabilidade e à bioeconomia da região.\n\nAs inscrições são gratuitas e o evento é híbrido, com etapas online e uma fase presencial no Hub de Inovação.',
    image_url:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    category: 'evento',
    published: true,
    published_at: '2026-09-20T12:00:00.000Z',
    author_id: '5',
    created_at: '2026-09-18T12:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z',
  },
  {
    id: '3',
    title: 'Análise: por que o custo de nuvem ainda trava projetos no Amazonas',
    excerpt:
      'Latência, largura de banda e tributação de ICMS sobre importação de dados pesam na conta final.',
    content:
      'A região Norte historicamente ficou de fora das zonas de baixa latência das nuvens globais. Isso significa que um backend hospedado fora de Manaus transforma cada requisição em uma ida e volta longa, e isso aparece na sensação de uso tanto quanto na fatura.\n\nSomam-se a isso a largura de banda disponível e a tributação de ICMS sobre a importação de dados, que em alguns casos chega a dobrar o custo efetivo da infraestrutura.',
    image_url:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    category: 'analise',
    published: true,
    published_at: '2026-09-05T12:00:00.000Z',
    author_id: '6',
    created_at: '2026-09-03T12:00:00.000Z',
    updated_at: '2026-09-05T12:00:00.000Z',
  },
  {
    id: '4',
    title: 'TechNorte anuncia oito vagas backend e abre programa de apprenticeship',
    excerpt:
      'Posições abertas para engenheiros em Go e PostgreSQL, com trilha estruturada de mentoria.',
    content:
      'A TechNorte abriu oito vagas para engenharia backend com foco em Go e PostgreSQL, além de um programa de apprenticeship para pessoas em início de carreira.\n\nAs posições são abertas para trabalho híbrido no Polo Industrial de Manaus. A trilha de apprenticeship combina estudo dirigido, revisão de código e mentoria individual.',
    image_url:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    category: 'vaga',
    published: false,
    published_at: null,
    author_id: '3',
    created_at: '2026-09-22T12:00:00.000Z',
    updated_at: '2026-09-22T12:00:00.000Z',
  },
];

export const MOCK_CHANNELS: CommunityChannel[] = [
  {
    id: '1',
    community_id: '1',
    name: 'Geral',
    description: 'Conversa aberta da comunidade, avisos e apresentações de novos membros.',
    platform: 'discord',
    url: 'https://discord.gg/manausdev',
    members_count: 1180,
    created_by: '7',
    created_at: '2026-01-10T12:00:00.000Z',
    updated_at: '2026-09-01T12:00:00.000Z',
  },
  {
    id: '2',
    community_id: '1',
    name: 'Vagas e Oportunidades',
    description: 'Compartilhamento de vagas, projetos freelance e chamadas de contratação.',
    platform: 'discord',
    url: 'https://discord.gg/manausdev-vagas',
    members_count: 640,
    created_by: '3',
    created_at: '2026-02-02T12:00:00.000Z',
    updated_at: '2026-09-02T12:00:00.000Z',
  },
  {
    id: '3',
    community_id: '2',
    name: 'Devs do Norte',
    description: 'Canal principal da rede de desenvolvedores que conecta talentos da Amazônia.',
    platform: 'telegram',
    url: 'https://t.me/devsdonorte',
    members_count: 890,
    created_by: '5',
    created_at: '2026-01-18T12:00:00.000Z',
    updated_at: '2026-08-28T12:00:00.000Z',
  },
  {
    id: '4',
    community_id: '3',
    name: 'Python Manaus',
    description: 'Canal do grupo de Python: eventos, bibliotecas e ajuda técnica entre membros.',
    platform: 'discord',
    url: 'https://discord.gg/pythonmanaus',
    members_count: 430,
    created_by: '4',
    created_at: '2026-03-05T12:00:00.000Z',
    updated_at: '2026-08-14T12:00:00.000Z',
  },
  {
    id: '5',
    community_id: '4',
    name: 'Mulheres na Tech AM',
    description: 'Canal de mentoria, networking e capacição da comunidade.',
    platform: 'whatsapp',
    url: 'https://chat.whatsapp.com/mulheresnatech',
    members_count: 310,
    created_by: '2',
    created_at: '2026-04-11T12:00:00.000Z',
    updated_at: '2026-08-30T12:00:00.000Z',
  },
];

export function getMockChannelsByCommunity(communityId: string): CommunityChannel[] {
  return MOCK_CHANNELS.filter((c) => c.community_id === communityId);
}

export function getMockProjectsByAuthor(authorId: string): Project[] {
  return MOCK_PROJECTS.filter((p) => p.author_id === authorId);
}

export function getMockEventsByOrganizer(organizerId: string): EventItem[] {
  return MOCK_EVENTS.filter((e) => e.organizer_id === organizerId);
}
