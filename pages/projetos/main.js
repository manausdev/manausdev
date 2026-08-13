import { api } from '../../js/api.js';
import { paginate, debounce } from '../../js/utils.js';

const PAGE_SIZE = 9;
const grid = document.getElementById('projects-grid');
const pagination = document.getElementById('projects-pagination');
const searchInput = document.getElementById('project-search');
const stackSelect = document.getElementById('stack-select');
const statusSelect = document.getElementById('status-select');
const sortSelect = document.getElementById('sort-select');
const clearBtn = document.getElementById('clear-project-filters');
const resultCount = document.querySelector('[data-search-result-count]');

let allProjects = [];
let currentPage = 1;

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    stack: params.get('stack') || '',
    status: params.get('status') || '',
    sort: params.get('sort') || 'recent',
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

function getStacks(projects) {
  const stackSet = new Set();
  projects.forEach((project) => {
    (project.stack || []).forEach((stack) => stackSet.add(stack));
  });
  return Array.from(stackSet).sort();
}

function renderStackOptions(stacks) {
  stackSelect.innerHTML = '<option value="">Todas</option>' +
    stacks.map((stack) => `<option value="${stack}">${stack}</option>`).join('');
}

function getStatusLabel(status) {
  const labels = {
    planning: 'Planejamento',
    active: 'Em andamento',
    completed: 'Concluído',
    paused: 'Pausado',
  };
  return labels[status] || status;
}

function getStatusBadgeClass(status) {
  const map = {
    planning: 'secondary',
    active: 'primary',
    completed: 'accent',
    paused: 'secondary',
  };
  return map[status] || 'secondary';
}

function renderCard(project) {
  const statusLabel = getStatusLabel(project.status);
  const statusClass = getStatusBadgeClass(project.status);

  return `
    <article class="card card--project" role="listitem" data-id="${project.id}">
      <div class="card-header">
        <h3 class="card-title">${project.title}</h3>
        <span class="badge badge-${statusClass}">${statusLabel}</span>
      </div>
      <div class="card-body">
        <p class="text-secondary">${project.description || 'Sem descrição'}</p>
        <div class="tags">
          ${(project.stack || []).slice(0, 5).map((s) => `<span class="badge badge-secondary">${s}</span>`).join('')}
        </div>
        <div class="card-footer">
          <a href="/#projects/${project.id}" class="btn btn-secondary btn-sm">Ver detalhes</a>
          ${project.repository ? `<a href="${project.repository}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm">Repo</a>` : ''}
          ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm">Demo</a>` : ''}
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

function sortProjects(list, sortKey) {
  const sorted = [...list];
  switch (sortKey) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    case 'popular':
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    case 'name-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

function applyFilters() {
  const params = getQueryParams();
  currentPage = params.page || 1;

  let filtered = [...allProjects];

  if (params.search) {
    const lower = params.search.toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(lower));
  }

  if (params.stack) {
    filtered = filtered.filter((p) => (p.stack || []).some((s) => s.toLowerCase() === params.stack.toLowerCase()));
  }

  if (params.status) {
    filtered = filtered.filter((p) => p.status === params.status);
  }

  filtered = sortProjects(filtered, params.sort);

  resultCount.textContent = `${filtered.length} projeto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  const paginated = paginate(filtered, currentPage, PAGE_SIZE);

  if (paginated.data.length === 0) {
    grid.innerHTML = '<p class="text-secondary" id="projects-empty">Nenhum projeto encontrado.</p>';
  } else {
    grid.innerHTML = paginated.data.map(renderCard).join('');
  }

  renderPagination(paginated.total, paginated.page);
}

function syncFiltersFromQuery() {
  const params = getQueryParams();
  searchInput.value = params.search;
  stackSelect.value = params.stack;
  statusSelect.value = params.status;
  sortSelect.value = params.sort;
}

function updateQueryFromFilters() {
  const params = {
    search: searchInput.value.trim(),
    stack: stackSelect.value,
    status: statusSelect.value,
    sort: sortSelect.value,
    page: '1',
  };

  setQueryParams(params);
  applyFilters();
}

async function init() {
  allProjects = await api.getAll('projects');

  const stacks = getStacks(allProjects);
  renderStackOptions(stacks);

  syncFiltersFromQuery();

  searchInput.addEventListener('input', debounce(() => {
    updateQueryFromFilters();
  }, 300));

  stackSelect.addEventListener('change', updateQueryFromFilters);
  statusSelect.addEventListener('change', updateQueryFromFilters);
  sortSelect.addEventListener('change', updateQueryFromFilters);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    stackSelect.value = '';
    statusSelect.value = '';
    sortSelect.value = 'recent';
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
