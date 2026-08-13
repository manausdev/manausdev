import { api } from '../../js/api.js';
import { paginate, debounce } from '../../js/utils.js';

const PAGE_SIZE = 9;
const grid = document.getElementById('communities-grid');
const pagination = document.getElementById('communities-pagination');
const searchInput = document.getElementById('community-search');
const resultCount = document.querySelector('[data-search-result-count]');

let allCommunities = [];
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

function getSocialLinks(community) {
  const links = [];
  if (community.discord) links.push({ label: 'Discord', href: community.discord, icon: 'D' });
  if (community.telegram) links.push({ label: 'Telegram', href: community.telegram, icon: 'T' });
  if (community.whatsapp) links.push({ label: 'WhatsApp', href: community.whatsapp, icon: 'W' });
  if (community.linkedin) links.push({ label: 'LinkedIn', href: community.linkedin, icon: 'L' });
  return links;
}

function formatMembers(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return String(count);
}

function renderCard(community) {
  const logo = community.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=0369a1&color=fff&size=128`;
  const members = formatMembers(community.members || 0);
  const socialLinks = getSocialLinks(community);

  return `
    <article class="card card--community" role="listitem" data-id="${community.id}">
      <div class="card-header card-header--center">
        <img
          src="${logo}"
          alt="Logo de ${community.name}"
          class="avatar"
          loading="lazy"
        >
        <h3 class="card-title">${community.name}</h3>
        <span class="badge badge-secondary">${community.type || 'Comunidade'}</span>
      </div>
      <div class="card-body">
        <p class="text-secondary">${community.description || 'Sem descrição'}</p>
        <p class="text-secondary"><strong>${members} membros</strong></p>
        <div class="tags">
          ${socialLinks.map((link) => `<a href="${link.href}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm">${link.label}</a>`).join('')}
          ${socialLinks.length === 0 ? '<span class="text-secondary" style="font-size: var(--text-sm);">Sem links</span>' : ''}
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

  let filtered = [...allCommunities];

  if (params.search) {
    const lower = params.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(lower) || (c.description || '').toLowerCase().includes(lower));
  }

  resultCount.textContent = `${filtered.length} comunidade${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`;

  const paginated = paginate(filtered, currentPage, PAGE_SIZE);

  if (paginated.data.length === 0) {
    grid.innerHTML = '<p class="text-secondary" id="communities-empty">Nenhuma comunidade encontrada.</p>';
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
  allCommunities = await api.getAll('communities');

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
