import { register, showToast, validateRequired, isValidUrl } from './main.js';
import { ROUTES } from '../../js/app.js';

const form = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const githubInput = document.getElementById('github');
const linkedinInput = document.getElementById('linkedin');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const github = githubInput.value.trim();
  const linkedin = linkedinInput.value.trim();

  if (!validateRequired(name, 'nome')) return;
  if (!validateRequired(email, 'email')) return;
  if (!validateRequired(password, 'senha')) return;
  if (!validateRequired(confirmPassword, 'confirmação de senha')) return;

  if (password !== confirmPassword) {
    showToast('As senhas não coincidem.');
    return;
  }

  if (github && !isValidUrl(github)) {
    showToast('URL do GitHub inválida.');
    return;
  }

  if (linkedin && !isValidUrl(linkedin)) {
    showToast('URL do LinkedIn inválida.');
    return;
  }

  try {
    await register(name, email, password);
    showToast('Conta criada com sucesso!', 'success');
    window.location.hash = ROUTES.HOME;
  } catch (error) {
    showToast(error.message || 'Falha no cadastro. Tente novamente.');
  }
});
