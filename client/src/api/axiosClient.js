import axios from 'axios'

// One shared Axios instance for the whole app, instead of creating a
// new instance (or repeating the base URL) in every API file.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // sends the httpOnly refresh token cookie automatically
})

// The access token lives in memory (not localStorage) for better security -
// it resets on page refresh, which is why we call /refresh-token on app load.
let accessToken = null

export function setAccessToken(token) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

// Attach the JWT to every outgoing request automatically.
axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// If a request fails with 401 (expired access token), try refreshing it
// once and retrying the original request. This is what lets a user stay
// logged in across page reloads without re-entering their password.
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isAuthRoute = originalRequest.url?.includes('/auth/')
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true
      try {
        const { data } = await axiosClient.post('/auth/refresh-token')
        setAccessToken(data.data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
        return axiosClient(originalRequest)
      } catch (refreshError) {
        setAccessToken(null)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
