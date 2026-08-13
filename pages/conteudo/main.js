import { api } from '../../js/api.js';
import { formatDate, truncate } from '../../js/utils.js';

const grid = document.getElementById('content-grid');
const tabs = document.querySelectorAll('[data-tab]');
const resultCount = document.querySelector('[data-search-result-count]');
const popularTagsContainer = document.getElementById('popular-tags');

const CATEGORY_LABELS = {
  todos: 'Conteúdo',
  artigos: 'Artigo',
  tutoriais: 'Tutorial',
  relatos: 'Relato',
  pesquisa: 'Pesquisa',
  academico: 'Conteúdo acadêmico',
};

const CATEGORY_BADGE_CLASSES = {
  artigos: 'primary',
  tutoriais: 'secondary',
  relatos: 'accent',
  pesquisa: 'primary',
  academico: 'secondary',
};

const MOCK_CONTENT = [
  {
    id: 1,
    title: 'O ecossistema tech de Manaus',
    summary: 'Manaus tem crescido no cenário tech com novas startups, eventos e uma comunidade cada vez mais engajada.',
    content: 'Manaus tem crescido no cenário tech com novas startups, eventos e uma comunidade cada vez mais engajada.',
    category: 'artigos',
    author: 'Ana Silva',
    publishedAt: '2026-08-01',
    tags: ['comunidade', 'ecossistema', 'manaus'],
  },
  {
    id: 2,
    title: 'Dicas para devs iniciantes',
    summary: 'Começar na programação pode ser desafiador. Aqui vão algumas dicas para quem está dando os primeiros passos.',
    content: 'Começar na programação pode ser desafiador. Aqui vão algumas dicas para quem está dando os primeiros passos.',
    category: 'tutoriais',
    author: 'Carlos Lima',
    publishedAt: '2026-08-05',
    tags: ['carreira', 'iniciantes', 'dicas'],
  },
  {
    id: 3,
    title: 'Relato: Hackathon Amazônia 2026',
    summary: 'Como foi participar do maior hackathon da região Norte e o que aprendemos com a experiência.',
    content: 'Como foi participar do maior hackathon da região Norte e o que aprendemos com a experiência.',
    category: 'relatos',
    author: 'Marina Souza',
    publishedAt: '2026-08-10',
    tags: ['hackathon', 'evento', 'amazônia'],
  },
  {
    id: 4,
    title: 'Pesquisa: Adoção de IA no Norte do Brasil',
    summary: 'Um estudo sobre como empresas de Manaus estão adotando inteligência artificial em seus processos.',
    content: 'Um estudo sobre como empresas de Manaus estão adotando inteligência artificial em seus processos.',
    category: 'pesquisa',
    author: 'Dr. Paulo Andrade',
    publishedAt: '2026-07-20',
    tags: ['ia', 'pesquisa', 'empresas'],
  },
  {
    id: 5,
    title: 'Conteúdo acadêmico: Arquitetura de Software',
    summary: 'Notas de aula e materiais complementares sobre arquitetura de software para estudantes de computação.',
    content: 'Notas de aula e materiais complementares sobre arquitetura de software para estudantes de computação.',
    category: 'academico',
    author: 'Prof. Lucia Ferreira',
    publishedAt: '2026-07-15',
    tags: ['arquitetura', 'acadêmico', 'ensino'],
  },
  {
    id: 6,
    title: 'Guia de TypeScript para iniciantes',
    summary: 'Um tutorial completo para quem quer aprender TypeScript do zero, com exemplos práticos.',
    content: 'Um tutorial completo para quem quer aprender TypeScript do zero, com exemplos práticos.',
    category: 'tutoriais',
    author: 'Bruno Costa',
    publishedAt: '2026-08-12',
    tags: ['typescript', 'iniciantes', 'frontend'],
  },
  {
    id: 7,
    title: 'Relato: Primeiro ano como dev júnior',
    summary: 'Reflexões sobre os desafios e aprendizados do primeiro ano trabalhando como desenvolvedor júnior.',
    content: 'Reflexões sobre os desafios e aprendizados do primeiro ano trabalhando como desenvolvedor júnior.',
    category: 'relatos',
    author: 'Fernanda Lima',
    publishedAt: '2026-08-08',
    tags: ['carreira', 'junior', 'experiência'],
  },
  {
    id: 8,
    title: 'Pesquisa: Acessibilidade na Web Amazônica',
    summary: 'Levantamento de práticas de acessibilidade em sites de organizações da região Norte.',
    content: 'Levantamento de práticas de acessibilidade em sites de organizações da região Norte.',
    category: 'pesquisa',
    author: 'Dra. Clara Mendes',
    publishedAt: '2026-07-28',
    tags: ['acessibilidade', 'pesquisa', 'web'],
  },
];

let allContent = [...MOCK_CONTENT];
let currentTab = 'artigos';

function getPopularTags() {
  const tagCounts = {};
  allContent.forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
}

function renderPopularTags() {
  const tags = getPopularTags();
  popularTagsContainer.innerHTML = tags
    .map((tag) => `<span class="badge badge-secondary" style="cursor: pointer;" data-tag="${tag}">${tag}</span>`)
    .join('');

  popularTagsContainer.querySelectorAll('[data-tag]').forEach((el) => {
    el.addEventListener('click', () => {
      const tag = el.dataset.tag;
      currentTab = 'todos';
      tabs.forEach((t) => {
        t.classList.toggle('tabs__tab--active', t.dataset.tab === 'todos');
        t.setAttribute('aria-selected', String(t.dataset.tab === 'todos'));
      });
      applyTabFilter(tag);
    });
  });
}

function renderCard(item) {
  const date = new Date(item.publishedAt + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `
    <article class="card" role="listitem" data-id="${item.id}" data-category="${item.category}">
      <div class="card-header">
        <span class="badge badge-${CATEGORY_BADGE_CLASSES[item.category] || 'secondary'}">${CATEGORY_LABELS[item.category] || item.category}</span>
        <h3 class="card-title" style="margin-top: var(--space-2);">${item.title}</h3>
      </div>
      <div class="card-body">
        <p class="text-secondary">${truncate(item.summary, 120)}</p>
        <p class="text-secondary"><strong>Autor:</strong> ${item.author}</p>
        <p class="text-secondary"><strong>Data:</strong> ${day}/${month}/${year}</p>
        <div class="tags">
          ${item.tags.map((tag) => `<span class="badge badge-primary">${tag}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}

function applyTabFilter(selectedTag = null) {
  let filtered = [...allContent];

  if (selectedTag) {
    filtered = filtered.filter((item) => item.tags.includes(selectedTag));
  } else if (currentTab !== 'todos') {
    filtered = filtered.filter((item) => item.category === currentTab);
  }

  resultCount.textContent = `${filtered.length} ${CATEGORY_LABELS[currentTab] || 'item'} encontrado${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="text-secondary" id="content-empty">Nenhum conteúdo encontrado.</p>';
  } else {
    grid.innerHTML = filtered.map(renderCard).join('');
  }
}

function switchTab(tab) {
  currentTab = tab;
  tabs.forEach((t) => {
    const isActive = t.dataset.tab === tab;
    t.classList.toggle('tabs__tab--active', isActive);
    t.setAttribute('aria-selected', String(isActive));
  });
  applyTabFilter();
}

async function init() {
  renderPopularTags();

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  applyTabFilter();
}

init();
