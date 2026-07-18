import axiosClient from './axiosClient'

// Every call here hits an admin-only backend route (see adminRoutes.js) -
// the backend rejects these for non-admins regardless of what the UI does.
export const adminApi = {
  getStats: () => axiosClient.get('/admin/stats'),
  getUsers: (params) => axiosClient.get('/admin/users', { params }),
  updateUserRole: (id, role) => axiosClient.put(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id) => axiosClient.put(`/admin/users/${id}/status`),
  deleteCategory: (id) => axiosClient.delete(`/admin/categories/${id}`),
}
