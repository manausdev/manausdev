import { api } from '../../js/api.js';
import { formatDate } from '../../js/utils.js';

const grid = document.getElementById('events-grid');
const tabs = document.querySelectorAll('[data-tab]');
const resultCount = document.querySelector('[data-search-result-count]');

let allEvents = [];
let currentTab = 'upcoming';

function isUpcoming(dateStr) {
  const eventDate = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

function getEventTypeLabel(type) {
  const labels = {
    meetup: 'Meetup',
    hackathon: 'Hackathon',
    workshop: 'Workshop',
    palestra: 'Palestra',
    conference: 'Conferência',
  };
  return labels[type] || type;
}

function getEventTypeBadgeClass(type) {
  const map = {
    meetup: 'primary',
    hackathon: 'accent',
    workshop: 'secondary',
    palestra: 'primary',
    conference: 'secondary',
  };
  return map[type] || 'secondary';
}

function renderCard(event) {
  const eventDate = new Date(event.date + 'T00:00:00');
  const day = String(eventDate.getDate()).padStart(2, '0');
  const month = String(eventDate.getMonth() + 1).padStart(2, '0');
  const year = eventDate.getFullYear();
  const time = event.time || '19:00';

  return `
    <article class="card" role="tabpanel" data-id="${event.id}">
      <div class="card-header">
        <h3 class="card-title">${event.title}</h3>
        <span class="badge badge-${getEventTypeBadgeClass(event.type)}">${getEventTypeLabel(event.type)}</span>
      </div>
      <div class="card-body">
        <p class="text-secondary"><strong>Data:</strong> ${day}/${month}/${year}</p>
        <p class="text-secondary"><strong>Horário:</strong> ${time}</p>
        <p class="text-secondary"><strong>Local:</strong> ${event.location || 'Local não informado'}</p>
        ${event.description ? `<p class="text-secondary">${event.description}</p>` : ''}
        <div class="card-footer">
          ${event.link ? `<a href="${event.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Inscrever-se</a>` : ''}
        </div>
      </div>
    </article>
  `;
}

function applyTabFilter() {
  let filtered = [...allEvents];

  if (currentTab === 'upcoming') {
    filtered = filtered.filter((e) => isUpcoming(e.date));
  } else {
    filtered = filtered.filter((e) => !isUpcoming(e.date));
  }

  resultCount.textContent = `${filtered.length} evento${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="text-secondary" id="events-empty">Nenhum evento encontrado.</p>';
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
  allEvents = await api.getAll('events');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  applyTabFilter();
}

init();
