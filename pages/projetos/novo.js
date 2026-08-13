import { requireAuth } from '../../js/auth.js';
import { api } from '../../js/api.js';
import { slugify, isValidUrl, debounce } from '../../js/utils.js';

const form = document.getElementById('project-form');
const nameInput = document.getElementById('project-name');
const slugInput = document.getElementById('project-slug');
const descriptionInput = document.getElementById('project-description');
const stackInput = document.getElementById('project-stack');
const repoInput = document.getElementById('project-repo');
const demoInput = document.getElementById('project-demo');
const websiteInput = document.getElementById('project-website');
const statusSelect = document.getElementById('project-status');
const licenseInput = document.getElementById('project-license');
const openSourceCheckbox = document.getElementById('project-opensource');
const collaboratorsCheckbox = document.getElementById('project-collaborators');
const imageInput = document.getElementById('project-image');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const toastContainer = document.getElementById('toast-container');

let currentUser = null;
let projectImageBase64 = null;

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `badge badge-${type === 'error' ? 'accent' : 'primary'}`;
  toast.style.cssText = 'padding: var(--space-3) var(--space-4); font-size: var(--text-sm); box-shadow: var(--shadow-md);';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showError(fieldId, message) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.color = 'var(--color-danger)';
  }
}

function clearError(fieldId) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = '';
  }
}

function clearAllErrors() {
  ['name', 'slug', 'description', 'repo', 'demo', 'website', 'status', 'image'].forEach(clearError);
}

function validateForm() {
  clearAllErrors();
  let isValid = true;

  const name = nameInput.value.trim();
  const slug = slugInput.value.trim();
  const description = descriptionInput.value.trim();
  const status = statusSelect.value;

  if (!name) {
    showError('name', 'Nome do projeto é obrigatório.');
    isValid = false;
  }

  if (!slug) {
    showError('slug', 'Slug é obrigatório.');
    isValid = false;
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    showError('slug', 'Slug deve conter apenas letras minúsculas, números e hífens.');
    isValid = false;
  }

  if (!description) {
    showError('description', 'Descrição é obrigatória.');
    isValid = false;
  }

  if (!status) {
    showError('status', 'Status é obrigatório.');
    isValid = false;
  }

  const repo = repoInput.value.trim();
  if (repo && !isValidUrl(repo)) {
    showError('repo', 'URL do repositório inválida.');
    isValid = false;
  }

  const demo = demoInput.value.trim();
  if (demo && !isValidUrl(demo)) {
    showError('demo', 'URL da demo inválida.');
    isValid = false;
  }

  const website = websiteInput.value.trim();
  if (website && !isValidUrl(website)) {
    showError('website', 'URL do website inválida.');
    isValid = false;
  }

  const imageFile = imageInput.files[0];
  if (imageFile) {
    if (imageFile.size > 5 * 1024 * 1024) {
      showError('image', 'A imagem deve ter no máximo 5MB.');
      isValid = false;
    } else if (!imageFile.type.startsWith('image/')) {
      showError('image', 'Arquivo deve ser uma imagem.');
      isValid = false;
    }
  }

  return isValid;
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildPayload() {
  const stackList = stackInput.value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return {
    title: nameInput.value.trim(),
    slug: slugInput.value.trim(),
    description: descriptionInput.value.trim(),
    stack: stackList,
    repository: repoInput.value.trim() || null,
    demo: demoInput.value.trim() || null,
    website: websiteInput.value.trim() || null,
    status: statusSelect.value,
    license: licenseInput.value.trim() || null,
    openSource: openSourceCheckbox.checked,
    lookingForCollaborators: collaboratorsCheckbox.checked,
    image: projectImageBase64,
    userId: currentUser.id,
    createdAt: new Date().toISOString(),
  };
}

async function handleSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    showToast('Corrija os erros antes de salvar.', 'error');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Salvando...';

  try {
    const payload = buildPayload();
    await api.create('projects', payload);
    showToast('Projeto criado com sucesso!');
    window.location.hash = '/#projects';
  } catch (err) {
    showToast(err.message || 'Erro ao criar projeto.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Salvar';
  }
}

async function handleImageChange() {
  const file = imageInput.files[0];
  if (!file) {
    projectImageBase64 = null;
    imagePreviewContainer.style.display = 'none';
    imagePreview.src = '';
    clearError('image');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showError('image', 'A imagem deve ter no máximo 5MB.');
    return;
  }

  try {
    projectImageBase64 = await fileToBase64(file);
    imagePreview.src = projectImageBase64;
    imagePreviewContainer.style.display = 'block';
    clearError('image');
  } catch (err) {
    showError('image', 'Erro ao carregar imagem.');
  }
}

function initRouteGuard() {
  try {
    requireAuth();
  } catch (err) {
    return;
  }

  const user = localStorage.getItem('currentUser');
  if (user) {
    currentUser = JSON.parse(user);
  }
}

function initSlugAutoGeneration() {
  const debouncedSlug = debounce(() => {
    if (slugInput.dataset.manual === 'true') return;
    slugInput.value = slugify(nameInput.value);
  }, 300);

  nameInput.addEventListener('input', debouncedSlug);
  slugInput.addEventListener('input', () => {
    slugInput.dataset.manual = 'true';
  });
  slugInput.addEventListener('blur', () => {
    slugInput.dataset.manual = 'false';
  });
}

function initForm() {
  form.addEventListener('submit', handleSubmit);
  imageInput.addEventListener('change', handleImageChange);

  [nameInput, slugInput, descriptionInput, statusSelect].forEach((el) => {
    el.addEventListener('input', () => {
      clearError(el.id.replace('project-', ''));
    });
  });

  [repoInput, demoInput, websiteInput].forEach((el) => {
    el.addEventListener('input', () => {
      clearError(el.id.replace('project-', ''));
    });
  });
}

initRouteGuard();
initSlugAutoGeneration();
initForm();
