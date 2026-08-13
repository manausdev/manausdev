import { login, isAuthenticated } from './main.js';
import { ROUTES } from '../../js/app.js';

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showToast('Preencha todos os campos.');
    return;
  }

  try {
    await login(email, password);
    showToast('Login realizado com sucesso!', 'success');
    window.location.hash = ROUTES.HOME;
  } catch (error) {
    showToast(error.message || 'Falha no login. Verifique suas credenciais.');
  }
});
