const STORAGE_KEY = 'manausdev_logs';
const MAX_LOGS = 1000;

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function log(message, data) {
  appendLog('debug', message, data);
}

export function warn(message, data) {
  appendLog('warn', message, data);
}

export function error(message, data) {
  appendLog('error', message, data);
}

export function getLogs(level) {
  const logs = loadLogs();
  if (!level) return logs;
  return logs.filter((entry) => entry.level === level);
}

export function clearLogs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

function appendLog(level, message, data) {
  const logs = loadLogs();
  logs.push({
    level,
    message,
    data: data || null,
    timestamp: new Date().toISOString(),
  });
  if (logs.length > MAX_LOGS) {
    logs.splice(0, logs.length - MAX_LOGS);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

  if (typeof console !== 'undefined') {
    const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[method](`[ManausDev ${level.toUpperCase()}] ${message}`, data || '');
  }
}

function loadLogs() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}
