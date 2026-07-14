import axiosClient from './axiosClient'

export const userApi = {
  getMyProfile: () => axiosClient.get('/users/me'),
  getUserProfile: (id) => axiosClient.get(`/users/${id}`),
  updateMyProfile: (data) => axiosClient.put('/users/me', data),
  updateAvatar: (formData) =>
    axiosClient.put('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
