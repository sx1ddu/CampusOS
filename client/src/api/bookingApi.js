import axiosClient from './axiosClient'

export const bookingApi = {
  createBooking: (data) => axiosClient.post('/bookings', data),
  // role is 'client' or 'provider' - matches the backend's ?role= query param
  getMyBookings: (role) => axiosClient.get('/bookings/my', { params: { role } }),
  updateBookingStatus: (id, status) => axiosClient.put(`/bookings/${id}/status`, { status }),
}
