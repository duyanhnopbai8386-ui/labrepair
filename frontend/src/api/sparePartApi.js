import api from './client';

export const sparePartApi = {
  getAll: () => api.get('/spare-parts'),
  getById: (id) => api.get(`/spare-parts/${id}`),
  getLowStock: () => api.get('/spare-parts/low-stock'),
  create: (data) => api.post('/spare-parts', data),
  update: (id, data) => api.put(`/spare-parts/${id}`, data),
  delete: (id) => api.delete(`/spare-parts/${id}`),
};
