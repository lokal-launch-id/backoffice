import { apiClient, API_ENDPOINTS } from '@/lib/api'
import { Product } from '../data/schema'
import { Category } from '../data/schema'

export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_items: number
  items_per_page: number
}

export interface ProductsResponse {
  data: Product[]
  meta: PaginationMeta
}

export interface ProductsRequest {
  name_en: string
  name_id: string
  tagline: string
  description_en: string
  description_id: string
  website_url: string
  logo_url: string
  category_id: string
  features: string[]
  tech_stack: string[]
  pricing?: string
  price_model?: 'free' | 'one_time' | 'subscription' | 'custom' | ''
  price_amount_idr?: number | null
  price_period?: 'month' | 'year' | ''
  accepts_local_payment?: boolean
  is_indonesian_spotlight?: boolean
  // Editorial flag: the API only accepts it from admins and moderators.
  is_featured?: boolean
  launch_date?: string
  image_urls: string[]
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  limit?: number
}

export interface ProductQueueItem {
  id: string
  name_en: string
  created_at: string
  user_id: string
  days_in_queue: number
}

export interface ProductQueueResponse {
  data: ProductQueueItem[]
  meta: PaginationMeta
}

export interface ProductModerationHistory {
  id: string
  product_id: string
  admin_id: string
  action: string
  // Empty for approvals; moderators must supply one when rejecting.
  reason: string
  created_at: string
}

export interface ModerationHistoryResponse {
  data: ProductModerationHistory[]
  meta: PaginationMeta
}

export class ProductsApi {
  static async getProducts(
    params?: PaginationParams
  ): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) {
      searchParams.append('page', params.page.toString())
    }
    if (params?.pageSize) {
      searchParams.append('page_size', params.pageSize.toString())
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString())
    }

    const endpoint =
      API_ENDPOINTS.products.list +
      (searchParams.toString() ? `?${searchParams.toString()}` : '')

    return apiClient.get<ProductsResponse>(endpoint)
  }

  // Get single product by ID
  static async getProduct(id: string): Promise<Product> {
    return apiClient.get<Product>(API_ENDPOINTS.products.detail(id))
  }

  // Create new product
  static async createProduct(productData: ProductsRequest): Promise<Product> {
    return apiClient.post<Product>(API_ENDPOINTS.products.create, {
      ...productData,
    })
  }

  // Update existing product
  // Takes the request shape, not Partial<Product>. The API reads category_id
  // and image_urls; a Product carries a nested `category` object and `images`
  // records, which it silently ignores - so edits to those simply never saved.
  static async updateProduct(
    id: string,
    productData: Partial<ProductsRequest> & { status?: string }
  ): Promise<Product> {
    return apiClient.patch<Product>(
      API_ENDPOINTS.products.update(id),
      productData
    )
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.products.delete(id))
  }

  // Get all categories
  static async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>(API_ENDPOINTS.categories.list)
  }

  // Update product status
  static async updateProductStatus(
    id: string,
    data: { status: string; reason?: string }
  ): Promise<void> {
    return apiClient.patch<void>(API_ENDPOINTS.products.updateStatus(id), {
      status: data.status,
      reason: data.reason,
    })
  }

  static async getPendingQueue(
    params?: PaginationParams
  ): Promise<ProductQueueResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) {
      searchParams.append('page', params.page.toString())
    }
    if (params?.pageSize) {
      searchParams.append('page_size', params.pageSize.toString())
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString())
    }
    const endpoint =
      '/moderator/products/pending-queue' +
      (searchParams.toString() ? `?${searchParams.toString()}` : '')
    return apiClient.get<ProductQueueResponse>(endpoint)
  }

  static async getModerationHistory(
    productId: string
  ): Promise<ModerationHistoryResponse> {
    return apiClient.get<ModerationHistoryResponse>(
      `/admin/products/${productId}/moderation-histories`
    )
  }

  // Global moderation log across all products.
  static async getAllModerationHistory(
    params?: PaginationParams
  ): Promise<ModerationHistoryResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) {
      searchParams.append('page', params.page.toString())
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString())
    }
    const endpoint =
      '/admin/moderation-histories' +
      (searchParams.toString() ? `?${searchParams.toString()}` : '')
    return apiClient.get<ModerationHistoryResponse>(endpoint)
  }

  // static async updateProductImages(id: string, images: string[]): Promise<void> {
  //  const endpoint = ?

  // }
}

// Export individual functions for convenience
export const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  updateProductStatus,
  getPendingQueue,
  getModerationHistory,
  getAllModerationHistory,
} = ProductsApi
