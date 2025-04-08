import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import ru from './ru.js';
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

yup.setLocale({
  string: {
    required: () => ({ key: 'errors.empty' }),
    url: () => ({ key: 'errors.url' }),
  },
  mixed: {
    notOneOf: () => ({ key: 'errors.alreadyOnTheList' }),
  },
});

// i18next
const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
})
  .then(() => {
    // View (представление)
    const watchedState = onChange(state, () => render(watchedState, elements, i18nextInstance));

    // Валидация
    const validateURL = (url) => {
      const schema = yup.string()
        .required()
        .url()
        .notOneOf(state.feeds);

      return schema.validate(url)
        .then(() => null)
        .catch((err) => {
          const translationKey = err.message.key || 'errors.unknown';
          return i18nextInstance.t(translationKey);
        });
    };

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
          watchedState.error = i18nextInstance.t('errors.unknown');
          watchedState.inputState = 'invalid';
        });
    });
  });
