import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import ru from './ru.js';
import render from './view.js';
import fetchRSS from './api.js';
import parse from './parser.js';

// Model (состояние)
const state = {
  inputState: 'filling', // valid, invalid
  inputValue: '',
  feeds: [],
  posts: [],
  error: null,
};

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
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
        .notOneOf(state.feeds.map((feed) => feed.link));

      return schema.validate(url)
        .then(() => null)
        .catch((error) => {
          const translationKey = error.message.key || 'errors.unknown';
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
            throw new Error(error);
          } else {
            watchedState.error = null;
            watchedState.inputState = 'valid';
            return url;
          }
        })
        .then((link) => {
          fetchRSS(link, i18nextInstance)
            .then((xml) => {
              const { feed, posts } = parse(xml, url, i18nextInstance);
              watchedState.feeds = [...watchedState.feeds, feed];
              watchedState.posts = [...watchedState.posts, ...posts];
              console.log(state);
            })
            .catch((error) => {
              watchedState.error = error.message;
              watchedState.inputState = 'invalid';
              console.log(state);
              throw new Error(watchedState.error);
            });
        });
    });
  });
