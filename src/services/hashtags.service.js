import api from './api';

export const hashtagsService = {
  getAll: (params = {}) => api.get('/hashtags', { params }).then((r) => r.data),
  create: (body) => api.post('/hashtags', body).then((r) => r.data),
  remove: (id) => api.delete(`/hashtags/${id}`).then((r) => r.data),
};
