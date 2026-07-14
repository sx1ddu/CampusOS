import axiosClient from './axiosClient'

export const reportApi = {
  createReport: (data) => axiosClient.post('/reports', data),
  // Admin-only endpoints - the backend rejects these for non-admins anyway,
  // but we also hide the buttons that call them in the UI.
  getReports: () => axiosClient.get('/reports'),
  resolveReport: (id) => axiosClient.put(`/reports/${id}/resolve`),
}
