import axiosClient from './axiosClient'

export const categoryApi = {
  getCategories: (type) => axiosClient.get('/categories', { params: { type } }),
}
