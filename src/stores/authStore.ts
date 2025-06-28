import Cookies from 'js-cookie'
import { create } from 'zustand'
import { apiClient } from '@/lib/api'

export interface AuthUser {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  bio: string | null
  avatar_url: string
  is_indonesian_maker: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  role: string
}

interface LoginResponse {
  token: string
  user: AuthUser
}

interface AuthState {
  // State
  user: AuthUser | null
  accessToken: string
  isLoading: boolean
  error: Error | null

  // Actions
  setUser: (user: AuthUser | null) => void
  setAccessToken: (accessToken: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
  resetAccessToken: () => void
  reset: () => void

  // Auth operations
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>

  // Initialize auth state (call this on app startup)
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const cookieState = Cookies.get('token')
  const initToken = cookieState ? JSON.parse(cookieState) : ''

  // Initialize API client with token if it exists
  if (initToken) {
    apiClient.setAccessToken(initToken)
  }

  return {
    // Initial state
    user: null,
    accessToken: initToken,
    isLoading: false,
    error: null,

    // State setters
    setUser: (user) => set({ user }),
    setAccessToken: (accessToken) => {
      Cookies.set('token', JSON.stringify(accessToken))
      apiClient.setAccessToken(accessToken)
      set({ accessToken })
    },
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    resetAccessToken: () => {
      Cookies.remove('token')
      apiClient.removeAccessToken()
      set({ accessToken: '' })
    },
    reset: () => {
      Cookies.remove('token')
      apiClient.removeAccessToken()
      set({ user: null, accessToken: '', error: null })
    },

    // Auth operations
    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null })
      try {
        const response = await apiClient.post<LoginResponse>('/login', {
          email,
          password,
        })
        const { token, user } = response

        // Set token and user
        get().setAccessToken(token)
        get().setUser(user)
        set({ isLoading: false })
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error : new Error('Login failed'),
        })
        throw error
      }
    },

    logout: async () => {
      set({ isLoading: true })
      try {
        await apiClient.post('/logout')
      } catch (_error) {
        // Continue with logout even if API call fails
        // Log error for debugging but don't block logout
      } finally {
        get().reset()
        set({ isLoading: false })
      }
    },

    getCurrentUser: async () => {
      const { accessToken } = get()
      if (!accessToken) return

      set({ isLoading: true, error: null })
      try {
        const user = await apiClient.get<AuthUser>('/users/me')
        get().setUser(user)
        set({ isLoading: false })
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          // Token is invalid, clear auth state
          get().reset()
        } else {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error : new Error('Failed to get user'),
          })
        }
      }
    },

    // Initialize auth state (call this on app startup)
    initialize: async () => {
      const { accessToken } = get()
      if (accessToken && !get().user) {
        await get().getCurrentUser()
      }
    },
  }
})

// Convenience hook for auth state
export const useAuth = () => {
  const store = useAuthStore()
  return {
    // State
    user: store.user,
    accessToken: store.accessToken,
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: !!store.accessToken && !!store.user,

    // Actions
    login: store.login,
    logout: store.logout,
    getCurrentUser: store.getCurrentUser,
    reset: store.reset,
  }
}
