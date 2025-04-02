export default (state, elements) => {
  elements.input.value = state.inputValue;

  // Отрисовка ошибок
  if (state.error) {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = state.error;
  } else {
    elements.input.classList.remove('is-invalid');
    elements.feedback.textContent = '';
  }

  // Отрисовка состояния поля ввода
  switch (state.inputState) {
    case 'filling':
      elements.input.value = '';
      elements.feedback.textContent = '';
      break;
    case 'valid':
      elements.input.value = '';
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = 'RSS успешно загружен';
      break;
    default:
      break;
  }
};
