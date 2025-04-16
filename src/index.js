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
  inputState: 'filling', // valid, invalid, sending
  inputValue: '',
  feeds: [],
  posts: [],
  error: null,
  activePostId: null,
};

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  submit: document.querySelector('[type="submit"]'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  modalHeader: document.querySelector('.modal-header'),
  modalBody: document.querySelector('.modal-body'),
  modalButtons: document.querySelectorAll('.btn-outline-primary'),
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
    // Обновление RSS потоков
    const updatePosts = (watchedState) => {
      watchedState.feeds.forEach((feed) => {
        fetchRSS(feed.link, i18nextInstance)
          .then((xml) => {
            const addedPostLinks = watchedState.posts.map((post) => post.link);
            const { posts } = parse(xml, feed.link, i18nextInstance, feed.id);
            const newPosts = posts.filter((post) => !addedPostLinks.includes(post.link));
            watchedState.posts = [...watchedState.posts, ...newPosts];
          })
          .catch((error) => {
            console.error(`Ошибка при получении данных из ${feed.id}:`, error);
          });
      });
      return setTimeout(updatePosts, 5000, watchedState);
    };

    // View (представление)
    const watchedState = onChange(state, (path) => render(path, state, elements, i18nextInstance));

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
      watchedState.inputState = 'filling';
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
            return url;
          }
        })
        .then((link) => {
          watchedState.inputState = 'sending';
          fetchRSS(link, i18nextInstance)
            .then((xml) => {
              const { feed, posts } = parse(xml, url, i18nextInstance);
              watchedState.feeds = [...watchedState.feeds, feed];
              watchedState.posts = [...watchedState.posts, ...posts];
              watchedState.inputState = 'valid';
            })
            .catch((error) => {
              watchedState.error = error.message;
              watchedState.inputState = 'invalid';
              throw new Error(watchedState.error);
            });
        });
    });

    elements.posts.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-outline-primary')) {
        e.preventDefault();
        watchedState.activePostId = e.target.dataset.id;
      }
    });

    updatePosts(watchedState);
  });
