import { api } from '../../js/api.js';
import { paginate, debounce } from '../../js/utils.js';

const PAGE_SIZE = 9;
const grid = document.getElementById('devs-grid');
const pagination = document.getElementById('devs-pagination');
const searchInput = document.getElementById('search-input');
const techSelect = document.getElementById('tech-select');
const areaSelect = document.getElementById('area-select');
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

function getTechs(devs) {
  const techSet = new Set();
  devs.forEach((dev) => {
    (dev.skills || []).forEach((skill) => techSet.add(skill));
  });
  return Array.from(techSet).sort();
}

function renderTechOptions(techs) {
  if (!techSelect) return;
  techSelect.innerHTML = '<option value="">Todas as tecnologias</option>' +
    techs.map((tech) => `<option value="${tech}">${tech}</option>`).join('');
}

function renderCard(dev) {
  const isAvailable = dev.available === true;

  return `
    <article class="glass-card rounded-2xl p-5 border-white/[0.08] flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 group" role="listitem" data-id="${dev.id}">
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-3">
            <img
              src="${dev.avatar || 'https://i.pravatar.cc/150?u=' + dev.id}"
              alt="Avatar de ${dev.name}"
              class="h-12 w-12 rounded-full border-2 border-primary/40 object-cover group-hover:border-primary transition-colors"
              loading="lazy"
            >
            <div>
              <h3 class="font-display text-base font-bold text-white group-hover:text-primary transition-colors">${dev.name}</h3>
              <p class="text-xs text-text-secondary">${dev.role || 'Desenvolvedor'}</p>
            </div>
          </div>
          <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${isAvailable ? 'bg-emerald/15 text-emerald border border-emerald/30' : 'bg-white/[0.06] text-text-muted'}">
            <span class="h-1.5 w-1.5 rounded-full ${isAvailable ? 'bg-emerald animate-pulse' : 'bg-text-muted'}"></span>
            ${isAvailable ? 'Disponível' : 'Ocupado'}
          </span>
        </div>
        <p class="text-xs text-text-secondary leading-relaxed line-clamp-2">${dev.bio || 'Desenvolvedor em Manaus apaixonado por tecnologia e inovação.'}</p>
      </div>

      <div>
        <div class="flex flex-wrap gap-1.5 mb-3">
          ${(dev.skills || []).slice(0, 4).map((skill) => `
            <span class="rounded-lg bg-surface-container-high/80 px-2 py-0.5 font-code text-[11px] text-primary border border-white/[0.05]">${skill}</span>
          `).join('')}
        </div>

        <div class="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span class="text-xs text-text-muted flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">location_on</span>
            ${dev.location || 'Manaus-AM'}
          </span>
          <div class="flex items-center gap-2">
            ${dev.github ? `
              <a href="${dev.github}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-text-secondary hover:text-white flex items-center gap-1">
                <span>GitHub</span>
              </a>
            ` : ''}
          </div>
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

  let filtered = [...allDevs];

  if (params.search) {
    const lower = params.search.toLowerCase();
    filtered = filtered.filter((dev) => 
      dev.name.toLowerCase().includes(lower) ||
      (dev.role || '').toLowerCase().includes(lower) ||
      (dev.skills || []).some(s => s.toLowerCase().includes(lower))
    );
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

  if (params.availability) {
    const isAvailable = params.availability === 'available';
    filtered = filtered.filter((dev) => dev.available === isAvailable);
  }

  if (resultCount) {
    resultCount.textContent = `${filtered.length} desenvolvedor${filtered.length !== 1 ? 'es' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;
  }

  const paginated = paginate(filtered, currentPage, PAGE_SIZE);

  if (paginated.data.length === 0) {
    grid.innerHTML = '<div class="col-span-full py-16 text-center text-text-muted glass-card rounded-2xl p-8">Nenhum desenvolvedor encontrado com esses filtros.</div>';
  } else {
    grid.innerHTML = paginated.data.map(renderCard).join('');
  }

  renderPagination(paginated.total, paginated.page);
}

function syncFiltersFromQuery() {
  const params = getQueryParams();
  if (searchInput) searchInput.value = params.search;
  if (techSelect) techSelect.value = params.tech;
  if (areaSelect) areaSelect.value = params.area;
  if (availabilitySelect) availabilitySelect.value = params.availability;
}

function updateQueryFromFilters() {
  const params = {
    search: searchInput ? searchInput.value.trim() : '',
    tech: techSelect ? techSelect.value : '',
    area: areaSelect ? areaSelect.value : '',
    availability: availabilitySelect ? availabilitySelect.value : '',
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

  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      updateQueryFromFilters();
    }, 300));
  }

  if (techSelect) techSelect.addEventListener('change', updateQueryFromFilters);
  if (areaSelect) areaSelect.addEventListener('change', updateQueryFromFilters);
  if (availabilitySelect) availabilitySelect.addEventListener('change', updateQueryFromFilters);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (techSelect) techSelect.value = '';
      if (areaSelect) areaSelect.value = '';
      if (availabilitySelect) availabilitySelect.value = '';
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
