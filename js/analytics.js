const STORAGE_KEY = 'manausdev_analytics';
const MAX_EVENTS = 500;

export function getStorageKey() {
  return STORAGE_KEY;
}

export function trackPageView(page) {
  const data = loadAnalytics();
  data.pageViews.push({
    page,
    timestamp: new Date().toISOString(),
  });
  if (data.pageViews.length > MAX_EVENTS) {
    data.pageViews = data.pageViews.slice(data.pageViews.length - MAX_EVENTS);
  }
  saveAnalytics(data);
}

export function trackEvent(category, action, label) {
  const data = loadAnalytics();
  data.events.push({
    category,
    action,
    label: label || null,
    timestamp: new Date().toISOString(),
  });
  if (data.events.length > MAX_EVENTS) {
    data.events = data.events.slice(data.events.length - MAX_EVENTS);
  }
  saveAnalytics(data);
}

export function getStats() {
  const data = loadAnalytics();
  return {
    pageViews: data.pageViews.length,
    events: data.events.length,
    lastPageView: data.pageViews[data.pageViews.length - 1] || null,
    eventsByCategory: groupBy(data.events, 'category'),
  };
}

export function clearAnalytics() {
  saveAnalytics({
    pageViews: [],
    events: [],
  });
}

function loadAnalytics() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      pageViews: [],
      events: [],
    };
  }
  try {
    return JSON.parse(stored);
  } catch {
    return {
      pageViews: [],
      events: [],
    };
  }
}

function saveAnalytics(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) acc[value] = 0;
    acc[value]++;
    return acc;
  }, {});
}
