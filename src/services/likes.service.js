import api from './api';

export const likesService = {
  toggle: (newsId) =>
    api.post('/likes', { newsId }).then((r) => r.data),
};
