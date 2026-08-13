import { login, register, isAuthenticated, getCurrentUser } from '../../js/auth.js';
import { isValidUrl } from '../../js/utils.js';
import { ROUTES } from '../../js/app.js';

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

function validateRequired(value, label) {
  if (!value || !value.trim()) {
    showToast(`O campo ${label} é obrigatório.`);
    return false;
  }
  return true;
}

export { showToast, validateRequired, isValidUrl, login, register, isAuthenticated, getCurrentUser, ROUTES };
