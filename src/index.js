import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './view.js';

// Model (состояние)
const state = {
  inputState: 'filling', // valid, invalid
  inputValue: '',
  feeds: [],
  error: null,
};

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
};

// Валидация
const validateURL = (url) => {
  const schema = yup.string()
    .required()
    .url('Ссылка должна быть валидным URL')
    .test(
      'is-unique',
      'RSS уже существует',
      (value) => !state.feeds.includes(value),
    );

  return schema.validate(url)
    .then(() => null)
    .catch((err) => err.message);
};

// View (представление)
const watchedState = onChange(state, () => render(watchedState, elements));

// Contoller (события)
elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');
  watchedState.inputValue = url;

  validateURL(url)
    .then((error) => {
      if (error) {
        watchedState.error = error;
        watchedState.inputState = 'invalid';
      } else {
        watchedState.error = null;
        watchedState.inputState = 'valid';
        watchedState.feeds.push(url);
      }
    })
    .catch(() => {
      watchedState.error = 'Неизвестная ошибка';
      watchedState.inputState = 'invalid';
    });
});
