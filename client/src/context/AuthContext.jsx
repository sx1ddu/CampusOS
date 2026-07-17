import { createContext, useState, useEffect } from 'react'
import { authApi } from '../api/authApi'
import { userApi } from '../api/userApi'
import { setAccessToken } from '../api/axiosClient'

export const AuthContext = createContext(null)

// Holds the logged-in user for the whole app. Any component can read
// `user` or call `login`/`logout` via the useAuth() hook instead of
// passing this data down through props on every page.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // On first load, try to silently log the user back in using the
  // httpOnly refresh token cookie from their last visit (if any).
  useEffect(() => {
    async function restoreSession() {
      try {
        const { data } = await authApi.refreshToken()
        setAccessToken(data.data.accessToken)
        const profileRes = await userApi.getMyProfile()
        setUser(profileRes.data.data.user)
      } catch {
        // No valid refresh token - user just isn't logged in, that's fine.
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [])

  async function login(email, password) {
    const { data } = await authApi.login({ email, password })
    setAccessToken(data.data.accessToken)
    setUser(data.data.user)
  }

  async function loginWithGoogle(idToken) {
    const { data } = await authApi.googleLogin(idToken)
    setAccessToken(data.data.accessToken)
    setUser(data.data.user)
  }

  async function logout() {
    await authApi.logout()
    setAccessToken(null)
    setUser(null)
  }

  const value = { user, setUser, isLoading, login, loginWithGoogle, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
