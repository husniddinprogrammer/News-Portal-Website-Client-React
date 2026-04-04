import api from './api';

/**
 * Build clean query params — remove null/undefined/empty string values
 */
const buildParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== '')
  );

export const newsService = {
  /**
   * GET /news — paginated news list with all filters
   * @param {Object} params - { page, limit, sort, time, category, hashtag, search, status, dateFrom, dateTo, rank }
   */
  getList: (params = {}) =>
    api.get('/news', { params: buildParams(params) }).then((r) => r.data),

  /**
   * GET /news/slug/:slug — news detail by slug (increments viewCount)
   */
  getBySlug: (slug) =>
    api.get(`/news/slug/${slug}`).then((r) => r.data),

  /**
   * GET /news/:id — admin detail by id
   */
  getById: (id) =>
    api.get(`/news/${id}`).then((r) => r.data),

  /**
   * POST /news — create news (ADMIN/BOSS)
   */
  create: (body) =>
    api.post('/news', body).then((r) => r.data),

  /**
   * PUT /news/:id — update news
   */
  update: (id, body) =>
    api.put(`/news/${id}`, body).then((r) => r.data),

  /**
   * DELETE /news/:id — soft delete
   */
  remove: (id) =>
    api.delete(`/news/${id}`).then((r) => r.data),
};
