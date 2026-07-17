import axiosClient from './axiosClient'

// Each function here maps 1:1 to a backend auth route (see authRoutes.js).
export const authApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  login: (data) => axiosClient.post('/auth/login', data),
  googleLogin: (idToken) => axiosClient.post('/auth/google', { idToken }),
  logout: () => axiosClient.post('/auth/logout'),
  refreshToken: () => axiosClient.post('/auth/refresh-token'),
  verifyEmail: (token) => axiosClient.get(`/auth/verify-email/${token}`),
  resendVerification: (email) => axiosClient.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => axiosClient.post(`/auth/reset-password/${token}`, { password }),
}
