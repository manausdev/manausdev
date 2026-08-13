import { initSeedData, hasSeedData } from './seed.js';
import { trackPageView } from './analytics.js';
import { log } from './logging.js';

export const ROUTES = {
  HOME: '#home',
  DEVELOPERS: '#developers',
  PROJECTS: '#projects',
  COMPANIES: '#companies',
  JOBS: '#jobs',
  EVENTS: '#events',
  COMMUNITIES: '#communities',
  ARTICLES: '#articles',
  LOGIN: '#login',
  REGISTER: '#register',
  PROFILE: '#profile',
  MY_PROJECTS: '#my-projects',
  SETTINGS: '#settings',
  NOT_FOUND: '#not-found',
};

export const AppState = {
  currentUser: null,
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
};

export const store = {
  get(key) {
    return AppState[key];
  },
  set(key, value) {
    AppState[key] = value;
  },
  clear() {
    Object.keys(AppState).forEach((key) => {
      if (key !== 'theme') AppState[key] = null;
    });
  },
};

export function initRouter(routes) {
  const navigate = (path) => {
    window.location.hash = path;
  };

  const getCurrentRoute = () => {
    return window.location.hash || ROUTES.HOME;
  };

  const onRouteChange = (handler) => {
    window.addEventListener('hashchange', () => handler(getCurrentRoute()));
    handler(getCurrentRoute());
  };

  const matchRoute = (hash) => {
    return Object.values(ROUTES).find((r) => hash.startsWith(r)) || ROUTES.NOT_FOUND;
  };

  return { navigate, getCurrentRoute, onRouteChange, matchRoute };
}

export function initApp() {
  const theme = localStorage.getItem('theme') || 'light';
  store.set('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('currentUser');
  if (token && user) {
    store.set('currentUser', JSON.parse(user));
  }

  if (!hasSeedData()) {
    initSeedData();
    log('Seed data initialized', { timestamp: new Date().toISOString() });
  }

  log('App initialized', { theme, hasUser: !!user });
}

export function initAnalytics() {
  const path = window.location.pathname;
  trackPageView(path);
  log('Page tracked', { path });
}
