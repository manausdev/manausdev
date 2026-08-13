const form = document.getElementById('feedbackForm');
const tipoSelect = document.getElementById('tipo');
const severidadeGroup = document.getElementById('severidade-group');

function showError(fieldId, message) {
  const el = document.getElementById(`error-${fieldId}`);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

tipoSelect?.addEventListener('change', () => {
  if (tipoSelect.value === 'bug') {
    severidadeGroup.style.display = 'flex';
  } else {
    severidadeGroup.style.display = 'none';
  }
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const tipo = form.tipo.value;
  const severidade = form.severidade?.value || '';
  const descricao = form.descricao.value.trim();

  let hasError = false;

  if (!nome) {
    showError('nome', 'Informe seu nome.');
    hasError = true;
  }

  if (!email) {
    showError('email', 'Informe seu email.');
    hasError = true;
  } else if (!validateEmail(email)) {
    showError('email', 'Email inválido.');
    hasError = true;
  }

  if (!tipo) {
    showError('tipo', 'Selecione o tipo de feedback.');
    hasError = true;
  }

  if (tipo === 'bug' && !severidade) {
    showError('severidade', 'Selecione a severidade.');
    hasError = true;
  }

  if (!descricao) {
    showError('descricao', 'Descreva seu feedback.');
    hasError = true;
  } else if (descricao.length < 20) {
    showError('descricao', 'A descrição deve ter pelo menos 20 caracteres.');
    hasError = true;
  }

  if (hasError) return;

  const payload = {
    nome,
    email,
    tipo,
    severidade: tipo === 'bug' ? severidade : null,
    descricao,
    submittedAt: new Date().toISOString()
  };

  console.log('Feedback enviado:', payload);
  showToast('Feedback enviado com sucesso! Obrigado por contribuir.', 'success');
  form.reset();
  if (severidadeGroup) severidadeGroup.style.display = 'none';
});
