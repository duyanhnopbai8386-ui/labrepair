import api from './client';

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getRoomCosts: () => api.get('/dashboard/room-costs'),
  getTopFailures: (limit = 10) => api.get(`/dashboard/top-failures?limit=${limit}`),
  getMonthlyCosts: () => api.get('/dashboard/monthly-costs'),
};
// lấy chỉ số thống kê 