import axiosClient from './axiosClient'

export const categoryApi = {
  getCategories: (type) => axiosClient.get('/categories', { params: { type } }),
  createCategory: (data) => axiosClient.post('/categories', data),
}
