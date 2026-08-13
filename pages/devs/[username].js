import { api } from '../../js/api.js';

const params = new URLSearchParams(window.location.search);
const username = params.get('username') || 'ana-silva';

const mockDevs = {
  'ana-silva': {
    id: 1,
    name: 'Ana Silva',
    username: 'ana-silva',
    avatar: 'https://i.pravatar.cc/150?u=1',
    role: 'Frontend Engineer',
    area: 'frontend',
    seniority: 'pleno',
    bio: 'Desenvolvedora apaixonada por interfaces modernas e acessibilidade.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Figma'],
    links: {
      github: 'https://github.com/anasilva',
      linkedin: 'https://linkedin.com/in/anasilva',
      website: 'https://anasilva.dev',
    },
    jobAvailability: 'Disponível para contratação',
    projectAvailability: 'Disponível para colaboração',
    projects: [
      { id: 'p1', title: 'ManausHub', description: 'Plataforma de conexão entre profissionais de tech da região.', link: '/projetos/manaus-hub' },
      { id: 'p2', title: 'Dashboard AM', description: 'Dashboard de métricas para comunidades tech.', link: '/projetos/dashboard-am' },
    ],
    communities: [
      { id: 'c1', name: 'Frontend AM', description: 'Discussões sobre interfaces, desempenho e acessibilidade web.' },
      { id: 'c2', name: 'Mulheres na Tech AM', description: 'Espaço de apoio e networking para mulheres na tecnologia.' },
    ],
  },
  'carlos-mendes': {
    id: 2,
    name: 'Carlos Mendes',
    username: 'carlos-mendes',
    avatar: 'https://i.pravatar.cc/150?u=2',
    role: 'Backend Developer',
    area: 'backend',
    seniority: 'senior',
    bio: 'Especialista em arquitetura distribuída e performance.',
    stack: ['Node.js', 'Go', 'Redis', 'PostgreSQL', 'Docker'],
    links: {
      github: 'https://github.com/carlosmendes',
      linkedin: 'https://linkedin.com/in/carlosmendes',
      website: null,
    },
    jobAvailability: 'Indisponível no momento',
    projectAvailability: 'Disponível para colaboração',
    projects: [
      { id: 'p3', title: 'RioTech Maps', description: 'Mapa interativo de hotspots de tecnologia no Amazonas.', link: '/projetos/riotech-maps' },
    ],
    communities: [
      { id: 'c3', name: 'Python Manaus', description: 'Comunidade de entusiastas e profissionais de Python.' },
    ],
  },
};

function getDevByUsername(username) {
  return mockDevs[username] || mockDevs['ana-silva'];
}

function renderDev(dev) {
  document.querySelector('[data-dev="name"]').textContent = dev.name;
  document.querySelector('[data-dev="username"]').textContent = `@${dev.username}`;
  document.querySelector('[data-dev="role"]').textContent = dev.role || 'Desenvolvedor';
  document.querySelector('[data-dev="area"]').textContent = dev.area ? dev.area.charAt(0).toUpperCase() + dev.area.slice(1) : 'Fullstack';
  document.querySelector('[data-dev="seniority"]').textContent = dev.seniority ? dev.seniority.charAt(0).toUpperCase() + dev.seniority.slice(1) : 'Pleno';
  document.querySelector('[data-dev="bio"]').textContent = dev.bio || 'Sem biografia.';

  const avatarImg = document.querySelector('[data-dev="avatar"]');
  if (dev.avatar) {
    avatarImg.src = dev.avatar;
    avatarImg.alt = `Avatar de ${dev.name}`;
  }

  const stackContainer = document.querySelector('[data-dev="stack"]');
  stackContainer.innerHTML = (dev.stack || []).map((s) => `<span class="badge badge-secondary">${s}</span>`).join('');

  document.querySelector('[data-dev="jobAvailability"]').textContent = dev.jobAvailability || 'Indisponível';
  document.querySelector('[data-dev="projectAvailability"]').textContent = dev.projectAvailability || 'Indisponível';

  if (dev.links) {
    const githubLink = document.querySelector('[data-dev="github"]');
    const linkedinLink = document.querySelector('[data-dev="linkedin"]');
    const websiteLink = document.querySelector('[data-dev="website"]');

    if (dev.links.github) { githubLink.href = dev.links.github; githubLink.style.display = 'inline-flex'; } else { githubLink.style.display = 'none'; }
    if (dev.links.linkedin) { linkedinLink.href = dev.links.linkedin; linkedinLink.style.display = 'inline-flex'; } else { linkedinLink.style.display = 'none'; }
    if (dev.links.website) { websiteLink.href = dev.links.website; websiteLink.style.display = 'inline-flex'; } else { websiteLink.style.display = 'none'; }
  }

  const projectsList = document.getElementById('dev-projects');
  if (dev.projects && dev.projects.length > 0) {
    projectsList.innerHTML = dev.projects.map((project) => `
      <li>
        <article class="card card--project" style="padding: var(--space-4);">
          <div class="card-header">
            <h3 class="card-title" style="font-size: var(--text-base);"><a href="${project.link}" style="color: var(--color-primary);">${project.title}</a></h3>
          </div>
          <div class="card-body">
            <p class="text-secondary" style="font-size: var(--text-sm);">${project.description}</p>
          </div>
        </article>
      </li>
    `).join('');
  } else {
    projectsList.innerHTML = '<li class="text-secondary">Nenhum projeto encontrado.</li>';
  }

  const communitiesList = document.getElementById('dev-communities');
  if (dev.communities && dev.communities.length > 0) {
    communitiesList.innerHTML = dev.communities.map((community) => `
      <li>
        <article class="card" style="padding: var(--space-4);">
          <div class="card-header">
            <h3 class="card-title" style="font-size: var(--text-base);">${community.name}</h3>
          </div>
          <div class="card-body">
            <p class="text-secondary" style="font-size: var(--text-sm);">${community.description}</p>
          </div>
        </article>
      </li>
    `).join('');
  } else {
    communitiesList.innerHTML = '<li class="text-secondary">Nenhuma comunidade encontrada.</li>';
  }

  document.title = `${dev.name} — Desenvolvedor | ManausDev`;
}

function init() {
  const dev = getDevByUsername(username);
  renderDev(dev);
}

init();
