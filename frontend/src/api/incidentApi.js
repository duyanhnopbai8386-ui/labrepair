import api from './client';

export const incidentApi = {
  getAll: (params) => api.get('/incidents', { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  create: (data) => api.post('/incidents', data),
  update: (id, data) => api.put(`/incidents/${id}`, data),
  assignTechnician: (id, technicianId) => api.put(`/incidents/${id}/assign?technicianId=${technicianId}`),
  updateStatus: (id, status) => api.put(`/incidents/${id}/status?status=${status}`),
  delete: (id) => api.delete(`/incidents/${id}`),
  // Lịch sử sửa chữa & trừ kho
  getHistories: (incidentId) => api.get(`/repair-histories/incident/${incidentId}`),
  recordHistory: (data) => api.post('/repair-histories', data),
};
