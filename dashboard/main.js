import { isAuthenticated, getCurrentUser, requireAuth } from '../js/auth.js';
import { ROUTES } from '../js/app.js';

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.dashboard-section');

function showSection(sectionId) {
  sections.forEach((section) => {
    const isTarget = section.id === sectionId;
    section.hidden = !isTarget;
    if (isTarget) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
  });
}

function getRouteSection(hash) {
  const map = {
    [ROUTES.PROFILE]: 'profile',
    [ROUTES.MY_PROJECTS]: 'my-projects',
    [ROUTES.SETTINGS]: 'settings',
  };
  return map[hash] || 'overview';
}

function toggleSidebar() {
  sidebar.classList.toggle('open');
}

function closeSidebar() {
  sidebar.classList.remove('open');
}

function initNavigation() {
  const hash = window.location.hash || ROUTES.HOME;
  const sectionId = getRouteSection(hash);
  showSection(sectionId);
}

if (!isAuthenticated()) {
  window.location.hash = ROUTES.LOGIN;
} else {
  const user = getCurrentUser();
  if (user) {
    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    if (nameEl) nameEl.value = user.name || '';
    if (emailEl) emailEl.value = user.email || '';
  }
}

sidebarToggle.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', closeSidebar);

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeSidebar();
  });
});

window.addEventListener('hashchange', initNavigation);

initNavigation();
