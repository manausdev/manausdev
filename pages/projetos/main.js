import { api } from '/js/api.js';
import { paginate, debounce } from '/js/utils.js';
import { initApp } from '/js/app.js';

const PAGE_SIZE = 9;
const grid = document.getElementById('projects-grid');
const pagination = document.getElementById('projects-pagination');
const searchInput = document.getElementById('project-search');
const stackSelect = document.getElementById('stack-select');
const clearBtn = document.getElementById('clear-project-filters');
const resultCount = document.querySelector('[data-search-result-count]');

let allProjects = [];
let currentPage = 1;

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    stack: params.get('stack') || '',
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
  if (!stackSelect) return;
  stackSelect.innerHTML = '<option value="">Todas as stacks</option>' +
    stacks.map((stack) => `<option value="${stack}">${stack}</option>`).join('');
}

function renderCard(project) {
  const repoLink = project.links && project.links.github ? project.links.github : null;
  const demoLink = project.links && project.links.demo ? project.links.demo : null;

  return `
    <article class="glass-card rounded-2xl p-5 border-white/[0.08] flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-secondary/50 group" role="listitem" data-id="${project.id}">
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2.5">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-[20px]">terminal</span>
            </span>
            <div>
              <h3 class="font-display text-base font-bold text-white group-hover:text-secondary transition-colors">${project.title}</h3>
              <span class="font-code text-[10px] text-text-muted">ID #${project.id}</span>
            </div>
          </div>
          <span class="rounded-full bg-primary/10 px-2.5 py-0.5 font-code text-[10px] font-semibold text-primary border border-primary/20">Ativo</span>
        </div>

        <p class="text-xs text-text-secondary leading-relaxed line-clamp-3">${project.description || 'Projeto construído e mantido por desenvolvedores de Manaus.'}</p>
      </div>

      <div>
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${(project.stack || []).slice(0, 4).map((s) => `
            <span class="rounded-lg bg-surface-container-high/80 px-2 py-0.5 font-code text-[11px] text-secondary border border-white/[0.05]">${s}</span>
          `).join('')}
        </div>

        <div class="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            ${repoLink ? `
              <a href="${repoLink}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-text-secondary hover:text-white flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">code</span>
                <span>GitHub</span>
              </a>
            ` : ''}
            ${demoLink ? `
              <a href="${demoLink}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                <span>Demo</span>
              </a>
            ` : ''}
          </div>
          <a href="/pages/projetos/[slug].html?id=${project.id}" class="text-xs font-semibold text-secondary hover:underline flex items-center gap-0.5">
            Ver detalhes <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
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
      html += `<button class="btn btn-primary btn-sm" disabled aria-current="page">${i}</button>`;
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

  let filtered = [...allProjects];

  if (params.search) {
    const lower = params.search.toLowerCase();
    filtered = filtered.filter((p) => 
      p.title.toLowerCase().includes(lower) || 
      (p.description || '').toLowerCase().includes(lower) ||
      (p.stack || []).some(s => s.toLowerCase().includes(lower))
    );
  }

  if (params.stack) {
    filtered = filtered.filter((p) => (p.stack || []).some((s) => s.toLowerCase() === params.stack.toLowerCase()));
  }

  if (resultCount) {
    resultCount.textContent = `${filtered.length} projeto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;
  }

  const paginated = paginate(filtered, currentPage, PAGE_SIZE);

  if (paginated.data.length === 0) {
    grid.innerHTML = '<div class="col-span-full py-16 text-center text-text-muted glass-card rounded-2xl p-8">Nenhum projeto encontrado com os filtros selecionados.</div>';
  } else {
    grid.innerHTML = paginated.data.map(renderCard).join('');
  }

  renderPagination(paginated.total, paginated.page);
}

function syncFiltersFromQuery() {
  const params = getQueryParams();
  if (searchInput) searchInput.value = params.search;
  if (stackSelect) stackSelect.value = params.stack;
}

function updateQueryFromFilters() {
  const params = {
    search: searchInput ? searchInput.value.trim() : '',
    stack: stackSelect ? stackSelect.value : '',
    page: '1',
  };

  setQueryParams(params);
  applyFilters();
}

async function init() {
  initApp();
  allProjects = await api.getAll('projects');

  const stacks = getStacks(allProjects);
  renderStackOptions(stacks);

  syncFiltersFromQuery();

  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      updateQueryFromFilters();
    }, 300));
  }

  if (stackSelect) stackSelect.addEventListener('change', updateQueryFromFilters);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (stackSelect) stackSelect.value = '';
      updateQueryFromFilters();
    });
  }

  if (pagination) {
    pagination.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-page]');
      if (!btn) return;
      const params = getQueryParams();
      params.page = btn.dataset.page;
      setQueryParams(params);
      applyFilters();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  window.addEventListener('popstate', () => {
    syncFiltersFromQuery();
    applyFilters();
  });

  applyFilters();
}

init();
