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

  // Update existing category.
  //
  // NOTE: the API exposes only GET /categories and POST /admin/categories.
  // There is no update or delete route yet, so this will 404 until one exists.
  // It targets the admin path rather than the public one it used to use, which
  // could never have been right.
  static async updateCategory(
    id: string,
    categoryData: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Category> {
    return apiClient.patch<Category>(
      API_ENDPOINTS.categories.update(id),
      categoryData
    )
  }

  // Delete category. See the note on updateCategory: no such route exists yet.
  static async deleteCategory(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.categories.delete(id))
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
