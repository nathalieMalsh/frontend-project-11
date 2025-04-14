export default (state, elements, i18nextInstance) => {
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
      elements.feedback.textContent = i18nextInstance.t('status.success');
      break;
    default:
      break;
  }

  // Отрисовка фидов
  if (state.feeds.length !== 0) {
    elements.feeds.innerHTML = '';
    const card = document.createElement('div');
    card.classList.add('card', 'border-0');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('card-title', 'h4');
    cardTitle.textContent = 'Фиды';

    elements.feeds.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle);

    state.feeds.forEach(({ title, description }) => {
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = title;
      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = description;

      card.append(ul);
      ul.append(li);
      li.append(h3);
      li.append(p);
    });
  }

  // Отрисовка постов
  if (state.posts.length !== 0) {
    elements.posts.innerHTML = '';
    const card = document.createElement('div');
    card.classList.add('card', 'border-0');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('card-title', 'h4');
    cardTitle.textContent = 'Посты';

    elements.posts.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle);

    state.posts.forEach(({ title, link, id }) => {
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const a = document.createElement('a');
      a.setAttribute('href', link);
      a.setAttribute('data-id', id);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.classList.add('fw-bold');
      a.textContent = title;

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('data-id', id);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.textContent = 'Просмотр';

      card.append(ul);
      ul.append(li);
      li.append(a);
      li.append(button);
    });
  }
};
