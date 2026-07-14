import axiosClient from './axiosClient'

export const serviceApi = {
  // filters can include: search, category, minPrice, maxPrice, page, limit
  getServices: (filters) => axiosClient.get('/services', { params: filters }),
  getServiceById: (id) => axiosClient.get(`/services/${id}`),
  getMyServices: () => axiosClient.get('/services/my-services'),
  createService: (formData) =>
    axiosClient.post('/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateService: (id, data) => axiosClient.put(`/services/${id}`, data),
  deleteService: (id) => axiosClient.delete(`/services/${id}`),
}
