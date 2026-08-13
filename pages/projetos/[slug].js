import { api } from '../../js/api.js';

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug') || 'manaus-hub';

const mockProjects = {
  'manaus-hub': {
    id: 'manaus-hub',
    name: 'ManausHub',
    description: 'Plataforma de conexão entre profissionais de tech da região.',
    screenshot: 'https://via.placeholder.com/1200x600?text=ManausHub',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind', 'Vercel'],
    status: 'active',
    license: 'MIT',
    openSource: true,
    lookingForCollaborators: true,
    links: {
      github: 'https://github.com/manausdev/manaus-hub',
      demo: 'https://manaushub.dev',
      website: 'https://manaushub.dev',
    },
    team: [
      { id: 'd1', name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=ana', role: 'Frontend Engineer' },
      { id: 'd2', name: 'Carlos Mendes', avatar: 'https://i.pravatar.cc/150?u=carlos', role: 'Backend Developer' },
    ],
  },
  'riotech-maps': {
    id: 'riotech-maps',
    name: 'RioTech Maps',
    description: 'Mapa interativo de hotspots de tecnologia no Amazonas.',
    screenshot: 'https://via.placeholder.com/1200x600?text=RioTech+Maps',
    stack: ['Vue', 'Python', 'Mapbox', 'FastAPI'],
    status: 'active',
    license: 'Apache 2.0',
    openSource: true,
    lookingForCollaborators: false,
    links: {
      github: 'https://github.com/manausdev/riotech-maps',
      demo: null,
      website: 'https://riotech-maps.vercel.app',
    },
    team: [
      { id: 'd3', name: 'Fernanda Lima', avatar: 'https://i.pravatar.cc/150?u=fernanda', role: 'Fullstack Developer' },
    ],
  },
};

function getProjectBySlug(slug) {
  return mockProjects[slug] || mockProjects['manaus-hub'];
}

function renderProject(project) {
  document.querySelector('[data-project="name"]').textContent = project.name;
  document.querySelector('[data-project="description"]').textContent = project.description;

  const screenshotImg = document.querySelector('[data-project="screenshot"]');
  const screenshotContainer = document.querySelector('[data-project="screenshot-container"]');
  if (project.screenshot) {
    screenshotImg.src = project.screenshot;
    screenshotImg.alt = `Screenshot de ${project.name}`;
    screenshotImg.style.display = 'block';
    screenshotContainer.style.display = 'block';
  } else {
    screenshotImg.style.display = 'none';
    screenshotContainer.style.display = 'none';
  }

  document.querySelector('[data-project="status"]').textContent = project.status === 'active' ? 'Em andamento' : project.status === 'planning' ? 'Planejamento' : project.status === 'completed' ? 'Concluído' : 'Pausado';
  document.querySelector('[data-project="license"]').textContent = project.license || 'N/A';
  document.querySelector('[data-project="opensource"]').textContent = project.openSource ? 'Sim' : 'Não';
  document.querySelector('[data-project="collaborators"]').textContent = project.lookingForCollaborators ? 'Sim' : 'Não';

  const stackContainer = document.querySelector('[data-project="stack"]');
  stackContainer.innerHTML = (project.stack || []).map((s) => `<span class="badge badge-secondary">${s}</span>`).join('');

  if (project.links) {
    const githubLink = document.querySelector('[data-project="github"]');
    const demoLink = document.querySelector('[data-project="demo"]');
    const websiteLink = document.querySelector('[data-project="website"]');

    if (project.links.github) { githubLink.href = project.links.github; githubLink.style.display = 'inline-flex'; } else { githubLink.style.display = 'none'; }
    if (project.links.demo) { demoLink.href = project.links.demo; demoLink.style.display = 'inline-flex'; } else { demoLink.style.display = 'none'; }
    if (project.links.website) { websiteLink.href = project.links.website; websiteLink.style.display = 'inline-flex'; } else { websiteLink.style.display = 'none'; }
  }

  const teamList = document.getElementById('project-team');
  if (project.team && project.team.length > 0) {
    teamList.innerHTML = project.team.map((member) => `
      <li>
        <article class="card card--developer" style="padding: var(--space-4);">
          <div class="card-header card-header--center">
            <img src="${member.avatar}" alt="Avatar de ${member.name}" class="avatar" style="width: 3rem; height: 3rem;" loading="lazy" />
            <h3 class="card-title" style="font-size: var(--text-base);">${member.name}</h3>
            <span class="badge badge-secondary">${member.role}</span>
          </div>
        </article>
      </li>
    `).join('');
  } else {
    teamList.innerHTML = '<li class="text-secondary">Nenhum membro na equipe.</li>';
  }

  document.title = `${project.name} — Projeto | ManausDev`;

  const shareUrl = encodeURIComponent(window.location.href);
  document.querySelector('[data-share="twitter"]').href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(project.name)}`;
  document.querySelector('[data-share="linkedin"]').href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
}

function init() {
  const project = getProjectBySlug(slug);
  renderProject(project);

  document.querySelector('[data-share="copy"]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.querySelector('[data-share="copy"]');
      const originalText = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(() => { btn.textContent = originalText; }, 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  });
}

init();
