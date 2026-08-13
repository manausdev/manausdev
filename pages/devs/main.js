import { api } from '../../js/api.js';
import { paginate, debounce } from '../../js/utils.js';

const PAGE_SIZE = 9;
const grid = document.getElementById('devs-grid');
const pagination = document.getElementById('devs-pagination');
const searchInput = document.getElementById('search-input');
const techSelect = document.getElementById('tech-select');
const areaSelect = document.getElementById('area-select');
const levelSelect = document.getElementById('level-select');
const availabilitySelect = document.getElementById('availability-select');
const clearBtn = document.getElementById('clear-filters');
const resultCount = document.querySelector('[data-search-result-count]');

let allDevs = [];
let currentPage = 1;

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    tech: params.get('tech') || '',
    area: params.get('area') || '',
    level: params.get('level') || '',
    availability: params.get('availability') || '',
    page: parseInt(params.get('page') || '1', 10),
  };
}

function setQueryParams(params) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState({}, '', url);
}

function getAreaFromSkills(skills) {
  const skillMap = {
    frontend: ['react', 'vue', 'angular', 'javascript', 'css', 'html', 'tailwind', 'sass'],
    backend: ['node.js', 'python', 'django', 'java', 'c#', 'php', 'ruby', 'go', 'express'],
    fullstack: ['react', 'vue', 'node.js', 'python', 'django'],
    mobile: ['flutter', 'react native', 'swift', 'kotlin', 'android', 'ios'],
    devops: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'jenkins'],
    data: ['python', 'sql', 'postgresql', 'mongodb', 'pandas', 'spark'],
    design: ['figma', 'ui', 'ux', 'photoshop', 'illustrator'],
  };

  const lowerSkills = skills.map((s) => s.toLowerCase());
  for (const [area, keywords] of Object.entries(skillMap)) {
    if (keywords.some((k) => lowerSkills.some((s) => s.includes(k)))) {
      return area;
    }
  }
  return 'fullstack';
}

function getLevelFromSkills(skills) {
  const lowerSkills = skills.map((s) => s.toLowerCase());
  if (lowerSkills.some((s) => ['architect', 'lead', 'tech lead'].some((t) => s.includes(t)))) {
    return 'lead';
  }
  if (lowerSkills.some((s) => ['senior', 'sr', 'especialista'].some((t) => s.includes(t)))) {
    return 'senior';
  }
  if (lowerSkills.some((s) => ['pleno', 'mid', 'intermediário'].some((t) => s.includes(t)))) {
    return 'pleno';
  }
  return 'junior';
}

function getTechs(devs) {
  const techSet = new Set();
  devs.forEach((dev) => {
    (dev.skills || []).forEach((skill) => techSet.add(skill));
  });
  return Array.from(techSet).sort();
}

function renderTechOptions(techs) {
  techSelect.innerHTML = '<option value="">Todas</option>' +
    techs.map((tech) => `<option value="${tech}">${tech}</option>`).join('');
}

function renderCard(dev) {
  const area = dev.area || getAreaFromSkills(dev.skills || []);
  const level = dev.level || getLevelFromSkills(dev.skills || []);
  const isAvailable = dev.available === true;

  return `
    <article class="card card--developer" role="listitem" data-id="${dev.id}">
      <div class="card-header card-header--center">
        <img
          src="${dev.avatar || 'https://i.pravatar.cc/150?u=' + dev.id}"
          alt="Avatar de ${dev.name}"
          class="avatar"
          loading="lazy"
        >
        <h3 class="card-title">${dev.name}</h3>
        <span class="badge badge-${isAvailable ? 'primary' : 'secondary'}">${isAvailable ? 'Disponível' : 'Indisponível'}</span>
      </div>
      <div class="card-body">
        <p class="text-secondary">${dev.role || 'Desenvolvedor'}</p>
        <div class="tags">
          ${(dev.skills || []).slice(0, 5).map((skill) => `<span class="badge badge-secondary">${skill}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}

function renderPagination(totalItems, current) {
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = '<div class="pagination__inner">';

  if (current > 1) {
    html += `<button class="btn btn-ghost btn-sm" data-page="${current - 1}" aria-label="Página anterior">Anterior</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === current) {
      html += `<button class="btn btn-sm" disabled aria-current="page">${i}</button>`;
    } else {
      html += `<button class="btn btn-ghost btn-sm" data-page="${i}">${i}</button>`;
    }
  }

  if (current < totalPages) {
    html += `<button class="btn btn-ghost btn-sm" data-page="${current + 1}" aria-label="Próxima página">Próxima</button>`;
  }

  html += '</div>';
  pagination.innerHTML = html;
}

function applyFilters() {
  const params = getQueryParams();
  currentPage = params.page || 1;

  let filtered = [...allDevs];

  if (params.search) {
    const lower = params.search.toLowerCase();
    filtered = filtered.filter((dev) => dev.name.toLowerCase().includes(lower));
  }

  if (params.tech) {
    filtered = filtered.filter((dev) => (dev.skills || []).some((s) => s.toLowerCase() === params.tech.toLowerCase()));
  }

  if (params.area) {
    filtered = filtered.filter((dev) => {
      const area = dev.area || getAreaFromSkills(dev.skills || []);
      return area === params.area;
    });
  }

  if (params.level) {
    filtered = filtered.filter((dev) => {
      const level = dev.level || getLevelFromSkills(dev.skills || []);
      return level === params.level;
    });
  }

  if (params.availability) {
    const isAvailable = params.availability === 'available';
    filtered = filtered.filter((dev) => dev.available === isAvailable);
  }

  resultCount.textContent = `${filtered.length} desenvolvedor${filtered.length !== 1 ? 'es' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  const paginated = paginate(filtered, currentPage, PAGE_SIZE);

  if (paginated.data.length === 0) {
    grid.innerHTML = '<p class="text-secondary" id="devs-empty">Nenhum desenvolvedor encontrado.</p>';
  } else {
    grid.innerHTML = paginated.data.map(renderCard).join('');
  }

  renderPagination(paginated.total, paginated.page);
}

function syncFiltersFromQuery() {
  const params = getQueryParams();
  searchInput.value = params.search;
  techSelect.value = params.tech;
  areaSelect.value = params.area;
  levelSelect.value = params.level;
  availabilitySelect.value = params.availability;
}

function updateQueryFromFilters() {
  const params = {
    search: searchInput.value.trim(),
    tech: techSelect.value,
    area: areaSelect.value,
    level: levelSelect.value,
    availability: availabilitySelect.value,
    page: '1',
  };

  setQueryParams(params);
  applyFilters();
}

async function init() {
  allDevs = await api.getAll('developers');

  const techs = getTechs(allDevs);
  renderTechOptions(techs);

  syncFiltersFromQuery();

  searchInput.addEventListener('input', debounce(() => {
    updateQueryFromFilters();
  }, 300));

  techSelect.addEventListener('change', updateQueryFromFilters);
  areaSelect.addEventListener('change', updateQueryFromFilters);
  levelSelect.addEventListener('change', updateQueryFromFilters);
  availabilitySelect.addEventListener('change', updateQueryFromFilters);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    techSelect.value = '';
    areaSelect.value = '';
    levelSelect.value = '';
    availabilitySelect.value = '';
    updateQueryFromFilters();
  });

  pagination.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-page]');
    if (!btn) return;
    const params = getQueryParams();
    params.page = btn.dataset.page;
    setQueryParams(params);
    applyFilters();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  window.addEventListener('popstate', () => {
    syncFiltersFromQuery();
    applyFilters();
  });

  applyFilters();
}

init();
