import axiosClient from './axiosClient'

export const resourceApi = {
  getResources: (filters) => axiosClient.get('/resources', { params: filters }),
  getResourceById: (id) => axiosClient.get(`/resources/${id}`),
  createResource: (formData) =>
    axiosClient.post('/resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateResource: (id, data) => axiosClient.put(`/resources/${id}`, data),
  deleteResource: (id) => axiosClient.delete(`/resources/${id}`),
}
