import axios from 'axios';

const getProxyUrl = (url) => `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`; // возвращает строку

const fetchRSS = (url, i18nextInstance) => {
  const proxyUrl = getProxyUrl(url);

  return axios.get(proxyUrl)
    .then((responce) => {
      if (responce.status !== 200) {
        throw new Error(i18nextInstance.t('errors.network'));
      }
      return responce.data.contents;
    })
    .catch(() => {
      throw new Error(i18nextInstance.t('errors.network'));
    })
};

export default fetchRSS;
