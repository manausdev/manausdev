import { api } from '../../js/api.js';
import { paginate, debounce } from '../../js/utils.js';

const PAGE_SIZE = 9;
const grid = document.getElementById('jobs-grid');
const pagination = document.getElementById('jobs-pagination');
const searchInput = document.getElementById('job-search');
const typeSelect = document.getElementById('type-select');
const modalitySelect = document.getElementById('modality-select');
const senioritySelect = document.getElementById('seniority-select');
const clearBtn = document.getElementById('clear-job-filters');
const resultCount = document.querySelector('[data-search-result-count]');

let allJobs = [];
let allCompanies = [];
let currentPage = 1;

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    type: params.get('type') || '',
    modality: params.get('modality') || '',
    seniority: params.get('seniority') || '',
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

function getCompanyById(companyId) {
  return allCompanies.find((c) => c.id === companyId) || null;
}

function getModalityLabel(remote) {
  if (remote === true) return 'Remoto';
  if (remote === 'hybrid') return 'Híbrido';
  return 'Presencial';
}

function getSeniorityFromTitle(title) {
  const lower = title.toLowerCase();
  if (lower.includes('lead') || lower.includes('tech lead') || lower.includes('líder')) return 'lead';
  if (lower.includes('senior') || lower.includes('sr ') || lower.includes('especialista')) return 'senior';
  if (lower.includes('pleno') || lower.includes('mid') || lower.includes('intermediário')) return 'pleno';
  return 'junior';
}

function renderCard(job) {
  const company = getCompanyById(job.companyId);
  const modality = getModalityLabel(job.remote);
  const seniority = job.seniority || getSeniorityFromTitle(job.title);

  return `
    <article class="card" role="listitem" data-id="${job.id}">
      <div class="card-header">
        <h3 class="card-title">${job.title}</h3>
        <span class="badge badge-primary">${job.type || 'CLT'}</span>
      </div>
      <div class="card-body">
        <p class="text-secondary">${company ? company.name : 'Empresa não informada'}</p>
        <p class="text-secondary">${modality}</p>
        ${job.salary ? `<p class="text-secondary"><strong>Salário:</strong> ${job.salary}</p>` : ''}
        <div class="tags">
          <span class="badge badge-secondary">${modality}</span>
          <span class="badge badge-accent">${seniority.charAt(0).toUpperCase() + seniority.slice(1)}</span>
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

  let filtered = [...allJobs];

  if (params.search) {
    const lower = params.search.toLowerCase();
    filtered = filtered.filter((job) => {
      const company = getCompanyById(job.companyId);
      return job.title.toLowerCase().includes(lower) || (company && company.name.toLowerCase().includes(lower));
    });
  }

  if (params.type) {
    filtered = filtered.filter((job) => job.type === params.type);
  }

  if (params.modality) {
    filtered = filtered.filter((job) => {
      const modality = getModalityLabel(job.remote);
      return modality === params.modality;
    });
  }

  if (params.seniority) {
    filtered = filtered.filter((job) => {
      const seniority = job.seniority || getSeniorityFromTitle(job.title);
      return seniority === params.seniority;
    });
  }

  resultCount.textContent = `${filtered.length} vaga${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`;

  const paginated = paginate(filtered, currentPage, PAGE_SIZE);

  if (paginated.data.length === 0) {
    grid.innerHTML = '<p class="text-secondary" id="jobs-empty">Nenhuma vaga encontrada.</p>';
  } else {
    grid.innerHTML = paginated.data.map(renderCard).join('');
  }

  renderPagination(paginated.total, paginated.page);
}

function syncFiltersFromQuery() {
  const params = getQueryParams();
  searchInput.value = params.search;
  typeSelect.value = params.type;
  modalitySelect.value = params.modality;
  senioritySelect.value = params.seniority;
}

function updateQueryFromFilters() {
  const params = {
    search: searchInput.value.trim(),
    type: typeSelect.value,
    modality: modalitySelect.value,
    seniority: senioritySelect.value,
    page: '1',
  };
  setQueryParams(params);
  applyFilters();
}

async function init() {
  const [jobs, companies] = await Promise.all([
    api.getAll('jobs'),
    api.getAll('companies'),
  ]);
  allJobs = jobs;
  allCompanies = companies;

  syncFiltersFromQuery();

  searchInput.addEventListener('input', debounce(() => {
    updateQueryFromFilters();
  }, 300));

  typeSelect.addEventListener('change', updateQueryFromFilters);
  modalitySelect.addEventListener('change', updateQueryFromFilters);
  senioritySelect.addEventListener('change', updateQueryFromFilters);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    typeSelect.value = '';
    modalitySelect.value = '';
    senioritySelect.value = '';
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
