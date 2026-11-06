import api from './client';

export const equipmentApi = {
  getAll: () => api.get('/equipment'),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
};
// thêm sửa xóa máy tính