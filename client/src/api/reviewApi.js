import axiosClient from './axiosClient'

export const reviewApi = {
  createReview: (data) => axiosClient.post('/reviews', data),
  getUserReviews: (userId) => axiosClient.get(`/reviews/user/${userId}`),
}
