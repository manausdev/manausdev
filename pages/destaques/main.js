import { api } from '../../js/api.js';
import { formatDate } from '../../js/utils.js';

const grid = document.getElementById('highlights-grid');
const resultCount = document.querySelector('[data-search-result-count]');

const MOCK_HIGHLIGHTS = [
  {
    id: 1,
    type: 'projeto',
    title: 'Projeto da semana',
    name: 'E-commerce Local',
    description: 'Plataforma para pequenos negócios de Manaus venderem online com integração de pagamentos locais.',
    author: 'Ana Silva',
    date: '2026-08-10',
    tags: ['e-commerce', 'node.js', 'react'],
    link: '/projetos/1',
  },
  {
    id: 2,
    type: 'desenvolvedor',
    title: 'Desenvolvedor em destaque',
    name: 'Carlos Lima',
    description: 'Desenvolvedor Python especializado em AWS, contribuiu com 5 projetos open source este mês.',
    author: 'Carlos Lima',
    date: '2026-08-08',
    tags: ['python', 'aws', 'opensource'],
    link: '/devs/carlos-lima',
  },
  {
    id: 3,
    type: 'empresa',
    title: 'Empresa em destaque',
    name: 'TechNorte',
    description: 'Empresa de tecnologia sediada em Manaus com foco em soluções para o varejo e logística.',
    author: 'TechNorte',
    date: '2026-08-05',
    tags: ['empresa', 'tecnologia', 'varejo'],
    link: '/empresas/1',
  },
  {
    id: 4,
    type: 'comunidade',
    title: 'Comunidade em destaque',
    name: 'Manaus Tech',
    description: 'Comunidade de tecnologia de Manaus com mais de 1200 membros ativos e eventos mensais.',
    author: 'Manaus Tech',
    date: '2026-08-01',
    tags: ['comunidade', 'eventos', 'networking'],
    link: '/comunidades/1',
  },
  {
    id: 5,
    type: 'evento',
    title: 'Evento em destaque',
    name: 'Meetup React Manaus',
    description: 'Encontro mensal da comunidade React de Manaus. Palestras, networking e muito código.',
    author: 'React Manaus',
    date: '2026-09-15',
    tags: ['react', 'meetup', 'evento'],
    link: '/eventos/1',
  },
];

let allHighlights = [...MOCK_HIGHLIGHTS];

const TYPE_LABELS = {
  projeto: 'Projeto',
  desenvolvedor: 'Desenvolvedor',
  empresa: 'Empresa',
  comunidade: 'Comunidade',
  evento: 'Evento',
};

const TYPE_BADGE_CLASSES = {
  projeto: 'primary',
  desenvolvedor: 'accent',
  empresa: 'secondary',
  comunidade: 'primary',
  evento: 'secondary',
};

function renderCard(item) {
  const date = new Date(item.date + 'T00:00:00');
  const formattedDate = formatDate(item.date);

  return `
    <article class="card" role="listitem" data-id="${item.id}" data-type="${item.type}">
      <div class="card-header card-header--center">
        <span class="badge badge-${TYPE_BADGE_CLASSES[item.type] || 'secondary'}">${TYPE_LABELS[item.type] || item.type}</span>
        <h3 class="card-title" style="font-size: var(--text-2xl);">${item.title}</h3>
      </div>
      <div class="card-body" style="text-align: center;">
        <h4 style="font-size: var(--text-xl); margin-bottom: var(--space-3);">${item.name}</h4>
        <p class="text-secondary">${item.description}</p>
        <p class="text-secondary"><strong>Data:</strong> ${formattedDate}</p>
        <div class="tags" style="justify-content: center; margin-top: var(--space-4);">
          ${item.tags.map((tag) => `<span class="badge badge-primary">${tag}</span>`).join('')}
        </div>
        ${item.link ? `<a href="${item.link}" class="btn btn-primary" style="margin-top: var(--space-4);">Ver mais</a>` : ''}
      </div>
    </article>
  `;
}

function applyFilters() {
  resultCount.textContent = `${allHighlights.length} destaque${allHighlights.length !== 1 ? 's' : ''} em evidência`;

  if (allHighlights.length === 0) {
    grid.innerHTML = '<p class="text-secondary">Nenhum destaque encontrado.</p>';
  } else {
    grid.innerHTML = allHighlights.map(renderCard).join('');
  }
}

async function init() {
  applyFilters();
}

init();
