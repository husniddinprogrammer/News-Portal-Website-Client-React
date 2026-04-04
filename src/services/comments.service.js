import api from './api';

export const commentsService = {
  getByNews: (newsId, params = {}) =>
    api.get(`/comments/news/${newsId}`, { params }).then((r) => r.data),

  create: (body) =>
    api.post('/comments', body).then((r) => r.data),

  remove: (id) =>
    api.delete(`/comments/${id}`).then((r) => r.data),
};
