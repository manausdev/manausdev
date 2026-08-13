import { initApp } from '../../js/app.js';

initApp();

const endpoints = [
  {
    method: 'GET',
    path: '/developers',
    description: 'Lista todos os desenvolvedores cadastrados.',
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Número da página (padrão: 1).' },
      { name: 'limit', type: 'integer', required: false, description: 'Itens por página (padrão: 20, máx: 100).' },
      { name: 'search', type: 'string', required: false, description: 'Busca por nome ou habilidade.' }
    ],
    requestExample: 'GET /v1/developers?page=1&limit=20&search=react',
    responseExample: {
      data: [
        { id: 1, name: 'Ana Silva', skills: ['React', 'TypeScript'], location: 'Manaus-AM', available: true },
        { id: 2, name: 'Carlos Lima', skills: ['Python', 'Django'], location: 'Manaus-AM', available: false }
      ],
      meta: { page: 1, limit: 20, total: 1240 }
    }
  },
  {
    method: 'GET',
    path: '/developers/:username',
    description: 'Retorna os detalhes de um desenvolvedor pelo username.',
    params: [
      { name: 'username', type: 'string', required: true, description: 'Username único do desenvolvedor.' }
    ],
    requestExample: 'GET /v1/developers/ana-silva',
    responseExample: {
      data: { id: 1, name: 'Ana Silva', username: 'ana-silva', skills: ['React', 'TypeScript'], location: 'Manaus-AM', available: true, bio: 'Frontend Engineer apaixonada por UX.' }
    }
  },
  {
    method: 'GET',
    path: '/projects',
    description: 'Lista todos os projetos cadastrados.',
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Número da página.' },
      { name: 'limit', type: 'integer', required: false, description: 'Itens por página.' },
      { name: 'stack', type: 'string', required: false, description: 'Filtro por tecnologia.' }
    ],
    requestExample: 'GET /v1/projects?stack=react',
    responseExample: {
      data: [
        { id: 1, name: 'ManausHub', description: 'Plataforma de conexão entre profissionais.', stack: ['React', 'Node.js'], status: 'active' }
      ],
      meta: { page: 1, limit: 20, total: 86 }
    }
  },
  {
    method: 'GET',
    path: '/projects/:slug',
    description: 'Retorna os detalhes de um projeto pelo slug.',
    params: [
      { name: 'slug', type: 'string', required: true, description: 'Slug único do projeto.' }
    ],
    requestExample: 'GET /v1/projects/manaus-hub',
    responseExample: {
      data: { id: 1, name: 'ManausHub', slug: 'manaus-hub', description: 'Plataforma de conexão.', stack: ['React', 'Node.js'], status: 'active', links: { github: 'https://github.com/manausdev/manaus-hub' } }
    }
  },
  {
    method: 'GET',
    path: '/companies',
    description: 'Lista todas as empresas cadastradas.',
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Número da página.' },
      { name: 'industry', type: 'string', required: false, description: 'Filtro por setor.' }
    ],
    requestExample: 'GET /v1/companies?industry=software',
    responseExample: {
      data: [
        { id: 1, name: 'TechNorte', industry: 'Software', location: 'Manaus-AM', size: '50-200' }
      ],
      meta: { page: 1, limit: 20, total: 45 }
    }
  },
  {
    method: 'GET',
    path: '/jobs',
    description: 'Lista todas as vagas disponíveis.',
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Número da página.' },
      { name: 'type', type: 'string', required: false, description: 'Filtro por tipo (CLT, PJ, estágio).' },
      { name: 'remote', type: 'boolean', required: false, description: 'Filtro por remoto (true/false).' }
    ],
    requestExample: 'GET /v1/jobs?remote=true&type=PJ',
    responseExample: {
      data: [
        { id: 1, title: 'Backend Developer', company: 'Amazônia Digital', type: 'PJ', remote: true, salary: 'R$ 5.000 - R$ 8.000' }
      ],
      meta: { page: 1, limit: 20, total: 37 }
    }
  },
  {
    method: 'GET',
    path: '/events',
    description: 'Lista todos os eventos cadastrados.',
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Número da página.' },
      { name: 'type', type: 'string', required: false, description: 'Filtro por tipo (meetup, hackathon, workshop).' },
      { name: 'from', type: 'date', required: false, description: 'Data inicial (YYYY-MM-DD).' },
      { name: 'to', type: 'date', required: false, description: 'Data final (YYYY-MM-DD).' }
    ],
    requestExample: 'GET /v1/events?from=2026-08-01&to=2026-12-31',
    responseExample: {
      data: [
        { id: 1, name: 'ManausDev Meetup #12', date: '2026-09-15', location: 'Auditório da UFAM', type: 'meetup' }
      ],
      meta: { page: 1, limit: 20, total: 24 }
    }
  },
  {
    method: 'GET',
    path: '/communities',
    description: 'Lista todas as comunidades cadastradas.',
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Número da página.' },
      { name: 'technology', type: 'string', required: false, description: 'Filtro por tecnologia principal.' }
    ],
    requestExample: 'GET /v1/communities?technology=python',
    responseExample: {
      data: [
        { id: 1, name: 'Python Manaus', description: 'Comunidade de entusiastas de Python.', technologies: ['Python', 'Data Science'], members: 850 }
      ],
      meta: { page: 1, limit: 20, total: 12 }
    }
  }
];

function renderBadge(method) {
  const color = method === 'GET' ? 'badge-primary' : 'badge-secondary';
  return `<span class="badge ${color}" style="font-size: var(--text-xs);">${method}</span>`;
}

function renderEndpoint(ep) {
  const codeExample = JSON.stringify(ep.responseExample, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `
    <article class="card" data-endpoint="${ep.path}" style="margin-bottom: var(--space-4);">
      <div class="card-header" style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
        ${renderBadge(ep.method)}
        <h3 class="card-title" style="flex: 1;"><code>${ep.path}</code></h3>
      </div>
      <div class="card-body">
        <p style="margin-bottom: var(--space-4);">${ep.description}</p>

        ${ep.params.length > 0 ? `
          <h4 style="margin-bottom: var(--space-3);">Parâmetros</h4>
          <div style="overflow-x: auto; margin-bottom: var(--space-4);">
            <table style="width: 100%; border-collapse: collapse; font-size: var(--text-sm);">
              <thead>
                <tr style="border-bottom: 2px solid var(--color-border);">
                  <th style="text-align: left; padding: var(--space-2);">Nome</th>
                  <th style="text-align: left; padding: var(--space-2);">Tipo</th>
                  <th style="text-align: left; padding: var(--space-2);">Obrigatório</th>
                  <th style="text-align: left; padding: var(--space-2);">Descrição</th>
                </tr>
              </thead>
              <tbody>
                ${ep.params.map(p => `
                  <tr style="border-bottom: 1px solid var(--color-border);">
                    <td style="padding: var(--space-2);"><code>${p.name}</code></td>
                    <td style="padding: var(--space-2);"><code>${p.type}</code></td>
                    <td style="padding: var(--space-2);">${p.required ? 'Sim' : 'Não'}</td>
                    <td style="padding: var(--space-2);">${p.description}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <h4 style="margin-bottom: var(--space-3);">Exemplo de requisição</h4>
        <pre style="margin-bottom: var(--space-4);"><code>${ep.requestExample}</code></pre>

        <h4 style="margin-bottom: var(--space-3);">Exemplo de resposta</h4>
        <pre><code>${codeExample}</code></pre>
      </div>
    </article>
  `;
}

function renderEndpoints() {
  const container = document.getElementById('endpoints-list');
  if (!container) return;
  container.innerHTML = endpoints.map(renderEndpoint).join('');
}

function init() {
  renderEndpoints();
  document.getElementById('current-year').textContent = new Date().getFullYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
