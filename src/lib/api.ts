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
    // Moderation decisions live under /moderator, not /admin: the route is open
    // to moderators and admins alike. Pointing this at /admin 403'd every
    // moderator who reached the queue.
    updateStatus: (id: string) => `/moderator/products/${id}/status`,
  },
  // Users
  users: {
    list: '/users',
    create: '/admin/users',
    detail: (id: string) => `/users/${id}`,
    profile: '/users/profile',
    delete: (id: string) => `/admin/users/${id}`,
    // Admin edits go through the admin route (role/maker/verified). The old
    // `/users/${id}` target was the ownership-scoped profile PATCH and could
    // not change role or verification.
    update: (id: string) => `/admin/users/${id}`,
    approve: (id: string) => `/admin/users/${id}/approve`,
    updateOwn: '/users/me',
  },
  // Categories
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`,
    create: '/admin/categories',
    update: (id: string) => `/admin/categories/${id}`,
    delete: (id: string) => `/admin/categories/${id}`,
  },
  // Auth
  auth: {
    register: '/register',
    login: '/login',
    logout: '/logout',
    refresh: '/refresh',
    resendVerification: '/auth/resend-verification',
  },
  // Utilities
  utilities: {
    upload: '/upload',
  },
  upload: {
    // The API exposes a single multipart endpoint. This used to point at
    // /upload/image, which has never existed and 404'd every upload.
    s3URL: '/upload',
  },
} as const

export const buildApiUrl = (endpoint: string): string => {
  return `${config.baseUrl}${endpoint}`
}

// Generic API client
/**
 * An HTTP failure that kept its status code.
 *
 * The client speaks fetch, not axios, so a bare Error left callers with nothing
 * to branch on and the session-expiry handling downstream could never fire.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

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
    options: RequestInit = {},
    isFormData = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      // Only set Content-Type for JSON, not for FormData
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
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
      // Handle 401 Unauthorized - clear the token. The redirect is left to the
      // QueryCache handler in main.tsx, which can reach the router.
      if (response.status === 401) {
        this.removeAccessToken()
      }

      // Try to parse error response body for more detailed error message
      let errorMessage = `${response.status} ${response.statusText}`
      try {
        const errorData = await response.json()
        if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch {
        // If we can't parse the error response, use the default message
      }

      throw new ApiError(response.status, errorMessage)
    }

    // A 204 carries no body, so response.json() would throw "Unexpected end of
    // JSON input" and turn a successful request into a rejected promise. That
    // is how DELETE looked broken from the UI while the server was returning
    // 204 and the row really was gone: the success handler never ran, so no
    // toast, no dialog close, no refetch. Checked by status and by an explicit
    // zero length rather than by method, so any endpoint that answers with an
    // empty body behaves.
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T
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

  // PUT request
  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: formData,
      },
      true
    )
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
