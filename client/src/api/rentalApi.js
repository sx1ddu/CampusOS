import axiosClient from './axiosClient'

export const rentalApi = {
  createRental: (data) => axiosClient.post('/rentals', data),
  getMyRentals: (role) => axiosClient.get('/rentals/my', { params: { role } }),
  updateRentalStatus: (id, status) => axiosClient.put(`/rentals/${id}/status`, { status }),
}
