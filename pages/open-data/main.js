import { initApp } from '../../js/app.js';

initApp();

const stats = [
  { label: 'Desenvolvedores', value: 1240, icon: '👩‍💻' },
  { label: 'Projetos open source', value: 86, icon: '🚀' },
  { label: 'Empresas', value: 45, icon: '🏢' },
  { label: 'Comunidades', value: 12, icon: '🤝' },
  { label: 'Eventos', value: 37, icon: '📅' },
  { label: 'Vagas ativas', value: 22, icon: '💼' }
];

const technologies = [
  { name: 'JavaScript', count: 342 },
  { name: 'Python', count: 278 },
  { name: 'TypeScript', count: 215 },
  { name: 'React', count: 198 },
  { name: 'Node.js', count: 176 },
  { name: 'Vue', count: 134 },
  { name: 'Go', count: 112 },
  { name: 'AWS', count: 98 },
  { name: 'Docker', count: 89 },
  { name: 'PostgreSQL', count: 76 }
];

const datasets = {
  'developers-csv': { name: 'Desenvolvedores', format: 'csv' },
  'developers-json': { name: 'Desenvolvedores', format: 'json' },
  'projects-csv': { name: 'Projetos', format: 'csv' },
  'projects-json': { name: 'Projetos', format: 'json' },
  'companies-csv': { name: 'Empresas', format: 'csv' },
  'companies-json': { name: 'Empresas', format: 'json' },
  'events-csv': { name: 'Eventos', format: 'csv' },
  'events-json': { name: 'Eventos', format: 'json' }
};

function formatNumber(num) {
  return num.toLocaleString('pt-BR');
}

function renderStats() {
  const container = document.getElementById('stats-grid');
  if (!container) return;
  container.innerHTML = stats.map(stat => `
    <article class="card" data-stat="${stat.label.toLowerCase()}" style="text-align: center;">
      <div style="font-size: var(--text-3xl); margin-bottom: var(--space-2);">${stat.icon}</div>
      <div style="font-size: var(--text-3xl); font-weight: var(--weight-bold); color: var(--color-primary);">${formatNumber(stat.value)}</div>
      <div style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-top: var(--space-1);">${stat.label}</div>
    </article>
  `).join('');
}

function renderTechChart() {
  const container = document.getElementById('tech-chart');
  if (!container) return;
  const max = Math.max(...technologies.map(t => t.count));
  container.innerHTML = technologies.map(tech => {
    const width = Math.round((tech.count / max) * 100);
    return `
      <div style="flex: 1 1 120px; min-width: 100px;">
        <div style="background-color: var(--color-bg-muted); border-radius: var(--radius-md); height: 180px; position: relative; display: flex; align-items: flex-end; overflow: hidden;">
          <div style="width: 100%; height: ${width}%; background: linear-gradient(to top, var(--color-primary), var(--color-accent)); border-radius: var(--radius-md) var(--radius-md) 0 0; transition: height var(--transition-base);"></div>
        </div>
        <div style="text-align: center; margin-top: var(--space-2); font-size: var(--text-sm); font-weight: var(--weight-medium);">${tech.name}</div>
        <div style="text-align: center; font-size: var(--text-xs); color: var(--color-text-muted);">${formatNumber(tech.count)}</div>
      </div>
    `;
  }).join('');
}

function downloadDataset(datasetKey) {
  const dataset = datasets[datasetKey];
  if (!dataset) return;

  let content = '';
  let mimeType = '';
  let extension = '';

  if (dataset.format === 'json') {
    content = JSON.stringify({ generatedAt: new Date().toISOString(), dataset: dataset.name, data: [] }, null, 2);
    mimeType = 'application/json';
    extension = 'json';
  } else {
    content = 'id,name,description,created_at\n';
    for (let i = 1; i <= 5; i++) {
      content += `${i},Exemplo ${dataset.name} ${i},Descrição simulada,2026-08-13\n`;
    }
    mimeType = 'text/csv';
    extension = 'csv';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${dataset.name.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function init() {
  renderStats();
  renderTechChart();
  document.getElementById('current-year').textContent = new Date().getFullYear();

  document.querySelectorAll('[data-download]').forEach(button => {
    button.addEventListener('click', () => {
      const datasetKey = button.dataset.download;
      downloadDataset(datasetKey);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
