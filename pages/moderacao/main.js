import { isAuthenticated, getCurrentUser } from '../../js/auth.js';

const mockReports = [
  { id: 'r1', type: 'denuncia', target: 'Projeto fake', reason: 'Spam', reporter: 'João Silva', date: '2026-08-10', status: 'pendente', description: 'Projeto clonado de repositório original sem créditos.' },
  { id: 'r2', type: 'denuncia', target: 'Comentário ofensivo', reason: 'Assédio', reporter: 'Maria Lima', date: '2026-08-11', status: 'pendente', description: 'Comentário com linguagem discriminatória em discussão pública.' },
  { id: 'r3', type: 'denuncia', target: 'Perfil falso', reason: 'Impersonificação', reporter: 'Carlos Souza', date: '2026-08-12', status: 'resolvida', description: 'Perfil usando foto e nome de terceiro para se passar por desenvolvedor conhecido.' },
  { id: 'r4', type: 'denuncia', target: 'Vaga enganosa', reason: 'Fraude', reporter: 'Ana Costa', date: '2026-08-13', status: 'pendente', description: 'Anúncio de vaga com link para phishing.' }
];

const mockUsers = [
  { id: 'u1', name: 'João Silva', email: 'joao@example.com', role: 'dev', reports: 2, status: 'ativos', joinedAt: '2026-01-15' },
  { id: 'u2', name: 'Maria Lima', email: 'maria@example.com', role: 'dev', reports: 0, status: 'ativos', joinedAt: '2026-02-20' },
  { id: 'u3', name: 'Carlos Souza', email: 'carlos@example.com', role: 'dev', reports: 3, status: 'suspensos', joinedAt: '2025-11-05' },
  { id: 'u4', name: 'Ana Costa', email: 'ana@example.com', role: 'admin', reports: 0, status: 'ativos', joinedAt: '2025-06-10' }
];

const mockContent = [
  { id: 'c1', title: 'Projeto X', author: 'João Silva', type: 'projeto', status: 'pendente', createdAt: '2026-08-09', reason: 'Conteúdo duplicado' },
  { id: 'c2', title: 'Vaga Frontend', author: 'TechNorte', type: 'vaga', status: 'aprovado', createdAt: '2026-08-08', reason: '' },
  { id: 'c3', title: 'Evento Hackathon', author: 'Fernanda Lima', type: 'evento', status: 'rejeitado', createdAt: '2026-08-07', reason: 'Data inválida' },
  { id: 'c4', title: 'Comentário em discussão', author: 'Carlos Souza', type: 'comentario', status: 'pendente', createdAt: '2026-08-13', reason: 'Linguagem inadequada' }
];

function showToast(message, type = 'error') {
  const container = document.createElement('div');
  container.className = `toast toast-${type}`;
  container.textContent = message;
  container.style.cssText = `
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    color: #fff;
    background: ${type === 'error' ? '#dc2626' : '#16a34a'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    font-size: 0.95rem;
    animation: toastIn 0.3s ease;
  `;
  document.body.appendChild(container);
  setTimeout(() => {
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease';
    setTimeout(() => container.remove(), 300);
  }, 3000);
}

function isAdminOrModerator(user) {
  return user && (user.role === 'admin' || user.role === 'moderator');
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'pendente':
      return 'badge-accent';
    case 'resolvida':
    case 'aprovado':
    case 'ativos':
      return 'badge-primary';
    case 'rejeitado':
    case 'suspensos':
    case 'banidos':
      return 'badge-secondary';
    default:
      return 'badge-primary';
  }
}

function getStatusLabel(status) {
  const labels = {
    pendente: 'Pendente',
    resolvida: 'Resolvida',
    aprovado: 'Aprovado',
    rejeitado: 'Rejeitado',
    ativos: 'Ativo',
    suspensos: 'Suspenso',
    banidos: 'Banido'
  };
  return labels[status] || status;
}

function renderReports(filter = 'pendente') {
  const container = document.getElementById('denuncias-list');
  if (!container) return;
  const filtered = filter === 'todos' ? mockReports : mockReports.filter(r => r.status === filter);
  container.innerHTML = filtered.map(report => `
    <article class="card" data-report-id="${report.id}">
      <div class="card-header">
        <h3 class="card-title">${report.target}</h3>
        <span class="badge ${getStatusBadgeClass(report.status)}">${getStatusLabel(report.status)}</span>
      </div>
      <div class="card-body">
        <p style="margin-bottom: var(--space-2);"><strong>Motivo:</strong> ${report.reason}</p>
        <p style="margin-bottom: var(--space-2);"><strong>Reportado por:</strong> ${report.reporter}</p>
        <p style="margin-bottom: var(--space-2);"><strong>Data:</strong> ${new Date(report.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
        <p style="margin-bottom: var(--space-4); color: var(--color-text-secondary);">${report.description}</p>
        <div class="card-footer">
          ${report.status === 'pendente' ? `
            <button class="btn btn-primary btn-sm" data-action="approve-report" data-id="${report.id}">Aprovar</button>
            <button class="btn btn-secondary btn-sm" data-action="reject-report" data-id="${report.id}">Rejeitar</button>
            <button class="btn btn-ghost btn-sm" data-action="hide-report" data-id="${report.id}">Ocultar</button>
          ` : '<span class="text-secondary">Ação não disponível</span>'}
        </div>
      </div>
    </article>
  `).join('');
  updateQueueCount();
}

function renderUsers(filter = 'ativos') {
  const container = document.getElementById('usuarios-list');
  if (!container) return;
  const filtered = filter === 'todos' ? mockUsers : mockUsers.filter(u => u.status === filter);
  container.innerHTML = filtered.map(user => `
    <article class="card" data-user-id="${user.id}">
      <div class="card-header">
        <h3 class="card-title">${user.name}</h3>
        <span class="badge ${getStatusBadgeClass(user.status)}">${getStatusLabel(user.status)}</span>
      </div>
      <div class="card-body">
        <p style="margin-bottom: var(--space-2);"><strong>Email:</strong> ${user.email}</p>
        <p style="margin-bottom: var(--space-2);"><strong>Função:</strong> ${user.role}</p>
        <p style="margin-bottom: var(--space-2);"><strong>Denúncias:</strong> ${user.reports}</p>
        <p style="margin-bottom: var(--space-4);"><strong>Cadastro:</strong> ${new Date(user.joinedAt + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
        <div class="card-footer">
          ${user.status === 'ativos' ? `
            <button class="btn btn-secondary btn-sm" data-action="suspend-user" data-id="${user.id}">Suspender</button>
            <button class="btn btn-ghost btn-sm" data-action="ban-user" data-id="${user.id}">Banir</button>
          ` : user.status === 'suspensos' ? `
            <button class="btn btn-primary btn-sm" data-action="reactivate-user" data-id="${user.id}">Reativar</button>
            <button class="btn btn-ghost btn-sm" data-action="ban-user" data-id="${user.id}">Banir</button>
          ` : '<span class="text-secondary">Ação não disponível</span>'}
        </div>
      </div>
    </article>
  `).join('');
}

function renderContent(filter = 'pendente') {
  const container = document.getElementById('conteudo-list');
  if (!container) return;
  const filtered = filter === 'todos' ? mockContent : mockContent.filter(c => c.status === filter);
  container.innerHTML = filtered.map(item => `
    <article class="card" data-content-id="${item.id}">
      <div class="card-header">
        <h3 class="card-title">${item.title}</h3>
        <span class="badge ${getStatusBadgeClass(item.status)}">${getStatusLabel(item.status)}</span>
      </div>
      <div class="card-body">
        <p style="margin-bottom: var(--space-2);"><strong>Autor:</strong> ${item.author}</p>
        <p style="margin-bottom: var(--space-2);"><strong>Tipo:</strong> ${item.type}</p>
        <p style="margin-bottom: var(--space-2);"><strong>Data:</strong> ${new Date(item.createdAt + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
        ${item.reason ? `<p style="margin-bottom: var(--space-4); color: var(--color-text-secondary);">${item.reason}</p>` : ''}
        <div class="card-footer">
          ${item.status === 'pendente' ? `
            <button class="btn btn-primary btn-sm" data-action="approve-content" data-id="${item.id}">Aprovar</button>
            <button class="btn btn-secondary btn-sm" data-action="reject-content" data-id="${item.id}">Rejeitar</button>
            <button class="btn btn-ghost btn-sm" data-action="hide-content" data-id="${item.id}">Ocultar</button>
          ` : '<span class="text-secondary">Ação não disponível</span>'}
        </div>
      </div>
    </article>
  `).join('');
}

function updateQueueCount() {
  const countEl = document.getElementById('queue-count');
  if (!countEl) return;
  const pending = mockReports.filter(r => r.status === 'pendente').length + mockContent.filter(c => c.status === 'pendente').length;
  countEl.textContent = `${pending} item(ns) na fila`;
}

function handleAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'approve-report') {
    const report = mockReports.find(r => r.id === id);
    if (report) { report.status = 'resolvida'; renderReports(getCurrentFilter('denuncias')); showToast('Denúncia aprovada.', 'success'); }
  } else if (action === 'reject-report') {
    const report = mockReports.find(r => r.id === id);
    if (report) { report.status = 'rejeitada'; renderReports(getCurrentFilter('denuncias')); showToast('Denúncia rejeitada.', 'success'); }
  } else if (action === 'hide-report') {
    showToast('Conteúdo ocultado.', 'success');
  } else if (action === 'suspend-user') {
    const user = mockUsers.find(u => u.id === id);
    if (user) { user.status = 'suspensos'; renderUsers(getCurrentFilter('usuarios')); showToast('Usuário suspenso.', 'success'); }
  } else if (action === 'ban-user') {
    const user = mockUsers.find(u => u.id === id);
    if (user) { user.status = 'banidos'; renderUsers(getCurrentFilter('usuarios')); showToast('Usuário banido.', 'success'); }
  } else if (action === 'reactivate-user') {
    const user = mockUsers.find(u => u.id === id);
    if (user) { user.status = 'ativos'; renderUsers(getCurrentFilter('usuarios')); showToast('Usuário reativado.', 'success'); }
  } else if (action === 'approve-content') {
    const item = mockContent.find(c => c.id === id);
    if (item) { item.status = 'aprovado'; renderContent(getCurrentFilter('conteudo')); showToast('Conteúdo aprovado.', 'success'); }
  } else if (action === 'reject-content') {
    const item = mockContent.find(c => c.id === id);
    if (item) { item.status = 'rejeitado'; renderContent(getCurrentFilter('conteudo')); showToast('Conteúdo rejeitado.', 'success'); }
  } else if (action === 'hide-content') {
    showToast('Conteúdo ocultado.', 'success');
  }
}

function getCurrentFilter(category) {
  const select = document.getElementById(`filter-${category}-status`);
  return select ? select.value : 'pendente';
}

function initTabs() {
  const tabs = document.querySelectorAll('.tabs__tab');
  const panels = {
    denuncias: document.getElementById('panel-denuncias'),
    usuarios: document.getElementById('panel-usuarios'),
    conteudo: document.getElementById('panel-conteudo')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('tabs__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('tabs__tab--active');
      tab.setAttribute('aria-selected', 'true');

      Object.values(panels).forEach(p => { if (p) p.hidden = true; });
      const key = tab.dataset.tab;
      if (panels[key]) panels[key].hidden = false;
    });
  });
}

function initFilters() {
  document.getElementById('filter-denuncias-status')?.addEventListener('change', (e) => renderReports(e.target.value));
  document.getElementById('filter-usuarios-status')?.addEventListener('change', (e) => renderUsers(e.target.value));
  document.getElementById('filter-conteudo-status')?.addEventListener('change', (e) => renderContent(e.target.value));
}

function init() {
  const user = getCurrentUser();
  const panel = document.getElementById('moderation-panel');
  const denied = document.getElementById('access-denied');

  if (!isAuthenticated() || !isAdminOrModerator(user)) {
    if (panel) panel.style.display = 'none';
    if (denied) denied.style.display = 'flex';
    return;
  }

  initTabs();
  initFilters();
  renderReports();
  renderUsers();
  renderContent();
  updateQueueCount();

  document.getElementById('moderation-panel')?.addEventListener('click', handleAction);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
