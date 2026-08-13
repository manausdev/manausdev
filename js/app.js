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

  console.log('ManausDev app initialized');
}
