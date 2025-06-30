import { apiClient, API_ENDPOINTS } from '@/lib/api'
import { User, UserListResponse } from '../data/schema'

export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_items: number
  items_per_page: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export class UsersApi {
  static async getUsers(params?: PaginationParams): Promise<UserListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) {
      searchParams.append('page', params.page.toString())
    }
    if (params?.pageSize) {
      searchParams.append('page_size', params.pageSize.toString())
    }

    const endpoint =
      API_ENDPOINTS.users.list +
      (searchParams.toString() ? `?${searchParams.toString()}` : '')

    return apiClient.get<UserListResponse>(endpoint)
  }

  // Get single user by ID
  static async getUser(id: string): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.users.detail(id))
  }

  // Create new user
  static async createUser(
    userData: Omit<User, 'id' | 'created_at' | 'updated_at'>
  ): Promise<User> {
    return apiClient.post<User>(API_ENDPOINTS.users.list, userData)
  }

  // Update existing user
  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return apiClient.put<User>(API_ENDPOINTS.users.detail(id), userData)
  }

  // Delete user
  static async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.users.delete(id))
  }

  static async resendVerificationEmail(email: string): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.auth.resendVerification, {
      email,
    })
  }
}

// Export individual functions for convenience
export const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resendVerificationEmail,
} = UsersApi
