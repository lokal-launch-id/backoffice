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
  },
  // Categories
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`,
  },
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
} as const

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${config.baseUrl}${endpoint}`
}

// Generic API client
export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = config.baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add delay in development if configured
    if (ENV.IS_DEV && ENV.DEV_API_DELAY > 0) {
      await new Promise((resolve) => setTimeout(resolve, ENV.DEV_API_DELAY))
    }

    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
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
