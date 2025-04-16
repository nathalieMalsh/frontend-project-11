import uniqueId from 'lodash/uniqueId.js';

const parse = (xml, url, i18nextInstance, feedId = uniqueId()) => {
  const posts = [];

  const domParser = new DOMParser();
  const doc = domParser.parseFromString(xml, 'text/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(i18nextInstance.t('errors.parseError'));
  }

  const feed = {
    link: url,
    id: feedId,
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
  };

  doc.querySelectorAll('item').forEach((item) => {
    posts.push({
      feedId,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      id: uniqueId(),
    });
  });

  return { feed, posts };
};

export default parse;
