import { api } from '../../js/api.js';
import { formatDate, sanitize } from '../../js/utils.js';

const grid = document.getElementById('teams-grid');
const searchInput = document.getElementById('team-search');
const categorySelect = document.getElementById('category-select');
const paidSelect = document.getElementById('paid-select');
const clearBtn = document.getElementById('clear-team-filters');
const teamForm = document.getElementById('team-form');
const resultCount = document.querySelector('[data-search-result-count]');

const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Fullstack',
  mobile: 'Mobile',
  design: 'Design',
  devops: 'DevOps',
  data: 'Data Science',
  outro: 'Outro',
};

const CATEGORY_BADGE_CLASSES = {
  frontend: 'primary',
  backend: 'accent',
  fullstack: 'secondary',
  mobile: 'primary',
  design: 'secondary',
  devops: 'accent',
  data: 'primary',
  outro: 'secondary',
};

const MOCK_TEAMS = [
  {
    id: 1,
    function: 'Desenvolvedor Frontend',
    tech: 'React, TypeScript, Tailwind',
    description: 'Procuro frontend developer para projeto de e-commerce local. Experiência com React e integração de APIs.',
    deadline: '2026-09-30',
    paid: true,
    category: 'frontend',
  },
  {
    id: 2,
    function: 'Desenvolvedor Backend',
    tech: 'Node.js, PostgreSQL, Redis',
    description: 'Projeto de plataforma de delivery. Necessito de backend developer para criar APIs e integração com serviços de pagamento.',
    deadline: '2026-10-15',
    paid: true,
    category: 'backend',
  },
  {
    id: 3,
    function: 'Designer UX/UI',
    tech: 'Figma, Adobe XD',
    description: 'Aplicativo de turismo em Manaus. Procuro designer para criar interface e experiência do usuário.',
    deadline: '2026-09-20',
    paid: false,
    category: 'design',
  },
  {
    id: 4,
    function: 'Desenvolvedor Mobile',
    tech: 'React Native, Expo',
    description: 'App de delivery de comida regional. Busco desenvolvedor mobile para构建 app multiplataforma.',
    deadline: '2026-11-01',
    paid: true,
    category: 'mobile',
  },
  {
    id: 5,
    function: 'Engenheiro DevOps',
    tech: 'AWS, Docker, Kubernetes',
    description: 'Infraestrutura para startup de e-commerce. Necessito de DevOps para CI/CD e deploy.',
    deadline: '2026-10-05',
    paid: true,
    category: 'devops',
  },
  {
    id: 6,
    function: 'Cientista de Dados',
    tech: 'Python, Pandas, Scikit-learn',
    description: 'Projeto de análise de dados do varejo local. Procuro data scientist para criar modelos de previsão.',
    deadline: '2026-11-15',
    paid: false,
    category: 'data',
  },
];

let allTeams = [...MOCK_TEAMS];

function renderCard(team) {
  const deadlineDate = new Date(team.deadline + 'T00:00:00');
  const formattedDeadline = formatDate(team.deadline);
  const isExpired = deadlineDate < new Date();

  return `
    <article class="card" role="listitem" data-id="${team.id}" data-category="${team.category}" data-paid="${team.paid}">
      <div class="card-header">
        <span class="badge badge-${CATEGORY_BADGE_CLASSES[team.category] || 'secondary'}">${CATEGORY_LABELS[team.category] || team.category}</span>
        <h3 class="card-title" style="margin-top: var(--space-2);">${team.function}</h3>
      </div>
      <div class="card-body">
        <p class="text-secondary"><strong>Tecnologias:</strong> ${team.tech}</p>
        <p class="text-secondary">${sanitize(team.description)}</p>
        <p class="text-secondary"><strong>Prazo:</strong> ${formattedDeadline} ${isExpired ? '<span style="color: var(--color-danger);">(Vencido)</span>' : ''}</p>
        <div class="tags">
          <span class="badge badge-primary">${team.paid ? 'Remunerado' : 'Voluntário'}</span>
        </div>
      </div>
    </article>
  `;
}

function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const paid = paidSelect.value;

  let filtered = [...allTeams];

  if (search) {
    filtered = filtered.filter((team) =>
      team.function.toLowerCase().includes(search) ||
      team.tech.toLowerCase().includes(search) ||
      team.description.toLowerCase().includes(search)
    );
  }

  if (category) {
    filtered = filtered.filter((team) => team.category === category);
  }

  if (paid) {
    const isPaid = paid === 'sim';
    filtered = filtered.filter((team) => team.paid === isPaid);
  }

  resultCount.textContent = `${filtered.length} anúncio${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="text-secondary" id="teams-empty">Nenhum anúncio encontrado.</p>';
  } else {
    grid.innerHTML = filtered.map(renderCard).join('');
  }
}

function clearFilters() {
  searchInput.value = '';
  categorySelect.value = '';
  paidSelect.value = '';
  applyFilters();
}

async function init() {
  searchInput.addEventListener('input', () => applyFilters());
  categorySelect.addEventListener('change', () => applyFilters());
  paidSelect.addEventListener('change', () => applyFilters());
  clearBtn.addEventListener('click', clearFilters);

  teamForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newTeam = {
      function: sanitize(document.getElementById('team-function').value),
      tech: sanitize(document.getElementById('team-tech').value),
      description: sanitize(document.getElementById('team-description').value),
      deadline: document.getElementById('team-deadline').value,
      paid: document.getElementById('team-paid').checked,
      category: 'outro',
    };

    const created = await api.create('teams', newTeam);
    allTeams.unshift(created);
    applyFilters();
    teamForm.reset();
  });

  applyFilters();
}

init();
