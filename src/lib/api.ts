import { getApiBaseUrl, shouldUseMockApi, ENV } from '@/config/environment'

// API Configuration
const config = {
  baseUrl: getApiBaseUrl(),
  useMockApi: shouldUseMockApi(),
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
  },
  // Users
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    profile: '/users/profile',
    delete: (id: string) => `/admin/users/${id}`,
    update: (id: string) => `/users/${id}`,
    updateOwn: '/users/me',
  },
  // Categories
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`,
  },
  // Auth
  auth: {
    register: '/register',
    login: '/login',
    logout: '/logout',
    refresh: '/refresh',
    resendVerification: '/auth/resend-verification',
  },
} as const

export const buildApiUrl = (endpoint: string): string => {
  return `${config.baseUrl}${endpoint}`
}

// Generic API client
export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = config.baseUrl
  }

  // Get access token from localStorage
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  }

  // Set access token in localStorage
  setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  }

  // Remove access token from localStorage
  removeAccessToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add custom headers if provided
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value
        }
      })
    }

    // Add authorization header if token exists
    const token = this.getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Add delay in development if configured
    if (ENV.IS_DEV && ENV.DEV_API_DELAY > 0) {
      await new Promise((resolve) => setTimeout(resolve, ENV.DEV_API_DELAY))
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      // Handle 401 Unauthorized - clear token and redirect to login
      if (response.status === 401) {
        this.removeAccessToken()
        // You might want to trigger a redirect to login here
        // window.location.href = '/login'
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // GET request
  async get<T>(
    endpoint: string,
    options?: { params?: Record<string, unknown> }
  ): Promise<T> {
    let url = endpoint

    // Add query parameters if provided
    if (options?.params) {
      const searchParams = new URLSearchParams()
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url = `${endpoint}?${queryString}`
      }
    }

    return this.request<T>(url, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export environment info for debugging
export const apiConfig = {
  isDevelopment: ENV.IS_DEV,
  baseUrl: config.baseUrl,
  useMockApi: config.useMockApi,
  endpoints: API_ENDPOINTS,
}
