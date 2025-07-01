import { apiClient, API_ENDPOINTS } from '@/lib/api'
import { Category } from '../data/schema'

export interface CategoriesResponse {
  data: Category[]
}

export interface CategoryRequest {
  name_en: string
  name_id: string
  icon_url: string
}

export class CategoriesApi {
  // Get all categories
  static async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>(API_ENDPOINTS.categories.list)
  }

  // Get single category by ID
  static async getCategory(id: string): Promise<Category> {
    return apiClient.get<Category>(API_ENDPOINTS.categories.detail(id))
  }

  // Create new category
  static async createCategory(
    categoryData: CategoryRequest
  ): Promise<Category> {
    return apiClient.post<Category>(API_ENDPOINTS.categories.create, {
      ...categoryData,
    })
  }

  // Update existing category
  static async updateCategory(
    id: string,
    categoryData: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Category> {
    return apiClient.patch<Category>(
      API_ENDPOINTS.categories.detail(id),
      categoryData
    )
  }

  // Delete category
  static async deleteCategory(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.categories.detail(id))
  }
}

// Export individual functions for convenience
export const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = CategoriesApi
