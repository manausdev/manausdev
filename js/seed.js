const STORAGE_KEY = 'manausdev_seed';

const DEVELOPERS = [
  { id: 1, name: 'Ana Silva', username: 'anasilva', email: 'ana.silva@example.com', role: 'Frontend Engineer', skills: ['React', 'TypeScript', 'Tailwind'], location: 'Manaus-AM', bio: 'Apaixonada por interfaces acessíveis e performance web.', github: 'https://github.com/anasilva', available: true },
  { id: 2, name: 'Bruno Costa', username: 'brunocosta', email: 'bruno.costa@example.com', role: 'Backend Developer', skills: ['Node.js', 'Go', 'Redis'], location: 'Manaus-AM', bio: 'Arquitetura de microsserviços e sistemas distribuídos.', github: 'https://github.com/brunocosta', available: true },
  { id: 3, name: 'Carlos Lima', username: 'carloslima', email: 'carlos.lima@example.com', role: 'Fullstack Developer', skills: ['Python', 'Django', 'AWS'], location: 'Manaus-AM', bio: 'Desenvolvedor fullstack com foco em soluções cloud.', github: 'https://github.com/carloslima', available: false },
  { id: 4, name: 'Fernanda Oliveira', username: 'fernandaoliveira', email: 'fernanda.oliveira@example.com', role: 'Mobile Developer', skills: ['React Native', 'Flutter', 'Firebase'], location: 'Manaus-AM', bio: 'Apps mobile performáticos e com boa UX.', github: 'https://github.com/fernandaoliveira', available: true },
  { id: 5, name: 'Gabriel Santos', username: 'gabrielsantos', email: 'gabriel.santos@example.com', role: 'DevOps Engineer', skills: ['Docker', 'Kubernetes', 'Terraform'], location: 'Manaus-AM', bio: 'CI/CD, infraestrutura como código e observabilidade.', github: 'https://github.com/gabrielsantos', available: true },
  { id: 6, name: 'Juliana Pereira', username: 'julianapereira', email: 'juliana.pereira@example.com', role: 'Data Engineer', skills: ['Python', 'Spark', 'SQL'], location: 'Manaus-AM', bio: 'Pipelines de dados e analytics em larga escala.', github: 'https://github.com/julianapereira', available: false },
  { id: 7, name: 'Lucas Almeida', username: 'lucasalmeida', email: 'lucas.almeida@example.com', role: 'Frontend Developer', skills: ['Vue', 'JavaScript', 'CSS'], location: 'Manaus-AM', bio: 'Interfaces modernas e animações suaves.', github: 'https://github.com/lucasalmeida', available: true },
  { id: 8, name: 'Mariana Souza', username: 'marianasouza', email: 'mariana.souza@example.com', role: 'QA Engineer', skills: ['Cypress', 'Jest', 'Playwright'], location: 'Manaus-AM', bio: 'Testes automatizados e qualidade de software.', github: 'https://github.com/marianasouza', available: true },
  { id: 9, name: 'Pedro Lima', username: 'pedrolima', email: 'pedro.lima@example.com', role: 'Backend Developer', skills: ['Java', 'Spring', 'PostgreSQL'], location: 'Manaus-AM', bio: 'APIs robustas e alta concorrência.', github: 'https://github.com/pedrolima', available: false },
  { id: 10, name: 'Rafael Nascimento', username: 'rafaelnascimento', email: 'rafael.nascimento@example.com', role: 'Fullstack Developer', skills: ['Next.js', 'Node.js', 'Prisma'], location: 'Manaus-AM', bio: 'Produtos digitais completos e escaláveis.', github: 'https://github.com/rafaelnascimento', available: true },
  { id: 11, name: 'Beatriz Rocha', username: 'beatrizrocha', email: 'beatriz.rocha@example.com', role: 'UX Engineer', skills: ['React', 'Figma', 'Acessibilidade'], location: 'Manaus-AM', bio: 'Pontes entre design e engenharia.', github: 'https://github.com/beatrizrocha', available: true },
  { id: 12, name: 'Diego Fernandes', username: 'diegofernandes', email: 'diego.fernandes@example.com', role: 'Cloud Architect', skills: ['AWS', 'Terraform', 'Go'], location: 'Manaus-AM', bio: 'Arquitetura cloud-native e serverless.', github: 'https://github.com/diegofernandes', available: false },
  { id: 13, name: 'Elena Vargas', username: 'elenavargas', email: 'elena.vargas@example.com', role: 'Frontend Developer', skills: ['React', 'GraphQL', 'Storybook'], location: 'Manaus-AM', bio: 'Design systems e componentização.', github: 'https://github.com/elenavargas', available: true },
  { id: 14, name: 'Felipe Araújo', username: 'felipearaujo', email: 'felipe.araujo@example.com', role: 'Mobile Developer', skills: ['Swift', 'Kotlin', 'Flutter'], location: 'Manaus-AM', bio: 'Apps nativos e cross-platform.', github: 'https://github.com/felipearaujo', available: true },
  { id: 15, name: 'Isabela Correia', username: 'isabelacorreia', email: 'isabela.correia@example.com', role: 'Data Scientist', skills: ['Python', 'TensorFlow', 'Pandas'], location: 'Manaus-AM', bio: 'Machine learning e análise de dados.', github: 'https://github.com/isabelacorreia', available: false },
  { id: 16, name: 'João Pedro', username: 'joaopedro', email: 'joao.pedro@example.com', role: 'Backend Developer', skills: ['Node.js', 'MongoDB', 'Redis'], location: 'Manaus-AM', bio: 'APIs RESTful e GraphQL.', github: 'https://github.com/joaopedro', available: true },
  { id: 17, name: 'Larissa Moraes', username: 'larissamoraes', email: 'larissa.moraes@example.com', role: 'Frontend Developer', skills: ['Vue', 'Nuxt', 'Tailwind'], location: 'Manaus-AM', bio: 'SPAs e SSR com Vue/Nuxt.', github: 'https://github.com/larissamoraes', available: true },
  { id: 18, name: 'Thiago Ribeiro', username: 'thiagoribeiro', email: 'thiago.ribeiro@example.com', role: 'Security Engineer', skills: ['Python', 'Pentest', 'SIEM'], location: 'Manaus-AM', bio: 'Segurança ofensiva e hardening.', github: 'https://github.com/thiagoribeiro', available: false },
  { id: 19, name: 'Camila Torres', username: 'camilatorres', email: 'camila.torres@example.com', role: 'Fullstack Developer', skills: ['JavaScript', 'React', 'Node.js'], location: 'Manaus-AM', bio: 'Produtos web de ponta a ponta.', github: 'https://github.com/camilatorres', available: true },
  { id: 20, name: 'Ricardo Barros', username: 'ricardobarros', email: 'ricardo.barros@example.com', role: 'Platform Engineer', skills: ['Go', 'Kubernetes', 'Prometheus'], location: 'Manaus-AM', bio: 'Plataformas internas e SRE.', github: 'https://github.com/ricardobarros', available: true },
  { id: 21, name: 'Natália Gomes', username: 'nataliagomes', email: 'natalia.gomes@example.com', role: 'QA Engineer', skills: ['Selenium', 'Cucumber', 'JMeter'], location: 'Manaus-AM', bio: 'Testes manuais e automatizados.', github: 'https://github.com/nataliagomes', available: false },
];

const PROJECTS = [
  { id: 1, title: 'ManausHub', description: 'Plataforma de conexão entre profissionais de tech da região.', stack: ['React', 'Node.js', 'PostgreSQL'], links: { github: 'https://github.com/manausdev/manaus-hub', demo: 'https://manaushub.dev' }, authorId: 1 },
  { id: 2, title: 'RioTech Maps', description: 'Mapa interativo de hotspots de tecnologia no Amazonas.', stack: ['Vue', 'Python', 'Mapbox'], links: { github: 'https://github.com/manausdev/riotech-maps' }, authorId: 3 },
  { id: 3, title: 'DevsAM', description: 'Diretório aberto de desenvolvedores do Amazonas.', stack: ['Next.js', 'Prisma', 'Tailwind'], links: { github: 'https://github.com/manausdev/devsam' }, authorId: 10 },
  { id: 4, title: 'Amazônia Tur', description: 'Guia turístico colaborativo de Manaus e arredores.', stack: ['React Native', 'Firebase', 'Mapbox'], links: { github: 'https://github.com/manausdev/amazonia-tur' }, authorId: 4 },
  { id: 5, title: 'Cidade Justa', description: 'App de mobilidade urbana e transporte público em Manaus.', stack: ['Flutter', 'Node.js', 'MongoDB'], links: { github: 'https://github.com/manausdev/cidadejusta' }, authorId: 7 },
  { id: 6, title: 'GreenCheck', description: 'Monitoramento ambiental com IoT na Amazônia.', stack: ['Python', 'MQTT', 'InfluxDB'], links: { github: 'https://github.com/manausdev/greencheck' }, authorId: 6 },
  { id: 7, title: 'VagasNorte', description: 'Agregador de vagas de tecnologia da região Norte.', stack: ['Next.js', 'GraphQL', 'Redis'], links: { github: 'https://github.com/manausdev/vagasnorte' }, authorId: 2 },
  { id: 8, title: 'AcessibilidadeWeb', description: 'Checklist e ferramentas para acessibilidade web.', stack: ['Vue', 'Storybook', 'Jest'], links: { github: 'https://github.com/manausdev/acessibilidade-web' }, authorId: 11 },
  { id: 9, title: 'Hackathon Dashboard', description: 'Dashboard para gestão de hackathons.', stack: ['React', 'Django', 'PostgreSQL'], links: { github: 'https://github.com/manausdev/hackathon-dashboard' }, authorId: 9 },
  { id: 10, title: 'TechNorte Podcast', description: 'Plataforma de podcast sobre tech na Amazônia.', stack: ['Next.js', 'Supabase', 'Tailwind'], links: { github: 'https://github.com/manausdev/technorte-podcast' }, authorId: 17 },
  { id: 11, title: 'Manaus Events', description: 'Agenda de eventos de tecnologia de Manaus.', stack: ['Vue', 'Node.js', 'SQLite'], links: { github: 'https://github.com/manausdev/manaus-events' }, authorId: 14 },
  { id: 12, title: 'Zodex', description: 'Marketplace de serviços digitais locais.', stack: ['React', 'Laravel', 'MySQL'], links: { github: 'https://github.com/manausdev/zodex' }, authorId: 16 },
];

const COMPANIES = [
  { id: 1, name: 'TechNorte', industry: 'Software', location: 'Manaus-AM', size: '50-200', website: 'https://technorte.dev' },
  { id: 2, name: 'Amazônia Digital', industry: 'E-commerce', location: 'Manaus-AM', size: '10-50', website: 'https://amazoniadigital.com.br' },
  { id: 3, name: 'RioApps', industry: 'Mobile', location: 'Manaus-AM', size: '10-50', website: 'https://rioapps.tech' },
  { id: 4, name: 'Zodex', industry: 'Marketplace', location: 'Manaus-AM', size: '10-50', website: 'https://zodex.com.br' },
  { id: 5, name: 'Sidia', industry: 'P&D', location: 'Manaus-AM', size: '200-500', website: 'https://sidia.com' },
  { id: 6, name: 'Fucapi', industry: 'P&D', location: 'Manaus-AM', size: '500-1000', website: 'https://fucapi.br' },
];

const COMMUNITIES = [
  { id: 1, name: 'Manaus Tech', description: 'Comunidade de tecnologia de Manaus.', members: 1200, type: 'tech' },
  { id: 2, name: 'Devs do Norte', description: 'Rede de desenvolvedores da região Norte.', members: 850, type: 'tech' },
  { id: 3, name: 'Python Manaus', description: 'Entusiastas e profissionais de Python.', members: 420, type: 'tech' },
  { id: 4, name: 'Frontend AM', description: 'Discussões sobre interfaces, desempenho e acessibilidade web.', members: 380, type: 'tech' },
  { id: 5, name: 'Mulheres na Tech AM', description: 'Apoio e networking para mulheres na tecnologia.', members: 290, type: 'tech' },
  { id: 6, name: 'AWS User Group Manaus', description: 'Comunidade oficial de usuários AWS na cidade.', members: 210, type: 'tech' },
  { id: 7, name: 'Data Science AM', description: 'Ciência de dados e machine learning na região.', members: 340, type: 'tech' },
];

const EVENTS = [
  { id: 1, title: 'ManausDev Meetup #12', date: '2026-09-15', location: 'Auditório da UFAM', type: 'meetup' },
  { id: 2, title: 'Hackathon Amazônia Tech', date: '2026-10-02', location: 'Online', type: 'hackathon' },
  { id: 3, title: 'Workshop de React Native', date: '2026-08-28', location: 'Hub de Inovação', type: 'workshop' },
  { id: 4, title: 'Python Manaus Conf', date: '2026-11-10', location: 'Teatro Amazonas', type: 'conference' },
  { id: 5, title: 'Cloud Day Manaus', date: '2026-12-05', location: 'Centro de Convenções', type: 'conference' },
  { id: 6, title: 'Open Source Friday', date: '2026-09-05', location: ' coworking Manaus', type: 'meetup' },
  { id: 7, title: 'Tech Career Talk', date: '2026-08-30', location: 'Online', type: 'meetup' },
  { id: 8, title: 'Hackathon Sustentabilidade', date: '2026-10-20', location: 'Fucapi', type: 'hackathon' },
];

const JOBS = [
  { id: 1, title: 'Desenvolvedor Frontend', companyId: 1, type: 'CLT', remote: false, salary: 'R$ 4.000 - R$ 6.000', link: '/vagas/j1' },
  { id: 2, title: 'Engenheiro de Software', companyId: 2, type: 'PJ', remote: true, salary: 'R$ 5.000 - R$ 8.000', link: '/vagas/j2' },
  { id: 3, title: 'Desenvolvedor Mobile', companyId: 3, type: 'CLT', remote: true, salary: 'R$ 3.500 - R$ 5.500', link: '/vagas/j3' },
  { id: 4, title: 'Backend Developer', companyId: 5, type: 'PJ', remote: false, salary: 'R$ 6.000 - R$ 9.000', link: '/vagas/j4' },
  { id: 5, title: 'QA Engineer', companyId: 6, type: 'CLT', remote: true, salary: 'R$ 3.000 - R$ 5.000', link: '/vagas/j5' },
  { id: 6, title: 'DevOps Engineer', companyId: 1, type: 'CLT', remote: false, salary: 'R$ 5.000 - R$ 7.500', link: '/vagas/j6' },
  { id: 7, title: 'UX Engineer', companyId: 4, type: 'PJ', remote: true, salary: 'R$ 4.500 - R$ 7.000', link: '/vagas/j7' },
  { id: 8, title: 'Data Engineer', companyId: 5, type: 'CLT', remote: false, salary: 'R$ 5.500 - R$ 8.500', link: '/vagas/j8' },
];

export function initSeedData() {
  if (localStorage.getItem(STORAGE_KEY)) {
    return;
  }

  const seed = {
    developers: DEVELOPERS,
    projects: PROJECTS,
    companies: COMPANIES,
    communities: COMMUNITIES,
    events: EVENTS,
    jobs: JOBS,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
}

export function getSeedData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function hasSeedData() {
  return !!localStorage.getItem(STORAGE_KEY);
}
