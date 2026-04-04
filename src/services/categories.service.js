import api from './api';

export const categoriesService = {
  getAll: () => api.get('/categories').then((r) => r.data),
  getById: (id) => api.get(`/categories/${id}`).then((r) => r.data),
  create: (body) => api.post('/categories', body).then((r) => r.data),
  update: (id, body) => api.put(`/categories/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};
