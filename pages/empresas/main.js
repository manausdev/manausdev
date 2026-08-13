import { api } from '../../js/api.js';
import { paginate, debounce } from '../../js/utils.js';

const PAGE_SIZE = 9;
const grid = document.getElementById('companies-grid');
const pagination = document.getElementById('companies-pagination');
const searchInput = document.getElementById('company-search');
const clearBtn = document.getElementById('clear-company-filters');
const resultCount = document.querySelector('[data-search-result-count]');

let allCompanies = [];
let allJobs = [];
let currentPage = 1;

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
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

function getCompanyJobCount(companyId) {
  return allJobs.filter((job) => job.companyId === companyId).length;
}

function getCompanyTechnologies(companyId) {
  const companyJobs = allJobs.filter((job) => job.companyId === companyId);
  const techSet = new Set();
  companyJobs.forEach((job) => {
    if (job.technologies) {
      job.technologies.forEach((t) => techSet.add(t));
    }
  });
  return Array.from(techSet).slice(0, 5);
}

function renderCard(company) {
  const jobCount = getCompanyJobCount(company.id);
  const technologies = getCompanyTechnologies(company.id);
  const logo = company.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=047857&color=fff&size=128`;

  return `
    <article class="card card--company" role="listitem" data-id="${company.id}">
      <div class="card-header card-header--center">
        <img
          src="${logo}"
          alt="Logo de ${company.name}"
          class="avatar"
          loading="lazy"
        >
        <h3 class="card-title">${company.name}</h3>
        <span class="badge badge-secondary">${company.industry || 'Empresa'}</span>
      </div>
      <div class="card-body">
        <p class="text-secondary">${company.description || company.industry || 'Sem descrição'}</p>
        <div class="tags">
          ${technologies.map((t) => `<span class="badge badge-secondary">${t}</span>`).join('')}
          ${technologies.length === 0 ? '<span class="badge badge-secondary">Geral</span>' : ''}
        </div>
        <div class="card-footer">
          <span class="text-secondary" style="font-size: var(--text-sm);">${jobCount} vaga${jobCount !== 1 ? 's' : ''} disponível${jobCount !== 1 ? 's' : ''}</span>
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

  let filtered = [...allCompanies];

  if (params.search) {
    const lower = params.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(lower) || (c.description || '').toLowerCase().includes(lower));
  }

  resultCount.textContent = `${filtered.length} empresa${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`;

  const paginated = paginate(filtered, currentPage, PAGE_SIZE);

  if (paginated.data.length === 0) {
    grid.innerHTML = '<p class="text-secondary" id="companies-empty">Nenhuma empresa encontrada.</p>';
  } else {
    grid.innerHTML = paginated.data.map(renderCard).join('');
  }

  renderPagination(paginated.total, paginated.page);
}

function syncFiltersFromQuery() {
  const params = getQueryParams();
  searchInput.value = params.search;
}

function updateQueryFromFilters() {
  const params = {
    search: searchInput.value.trim(),
    page: '1',
  };
  setQueryParams(params);
  applyFilters();
}

async function init() {
  const [companies, jobs] = await Promise.all([
    api.getAll('companies'),
    api.getAll('jobs'),
  ]);
  allCompanies = companies;
  allJobs = jobs;

  syncFiltersFromQuery();

  searchInput.addEventListener('input', debounce(() => {
    updateQueryFromFilters();
  }, 300));

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
