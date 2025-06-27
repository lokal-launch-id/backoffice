import { useAuthStore } from '@/stores/authStore'

// Re-export the useAuth hook from the store for convenience
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

// Individual hooks for specific auth state
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthToken = () => useAuthStore((state) => state.accessToken)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.accessToken && !!state.user)

// Auth action hooks
export const useAuthActions = () => {
  const store = useAuthStore()
  return {
    login: store.login,
    logout: store.logout,
    getCurrentUser: store.getCurrentUser,
    reset: store.reset,
  }
}
