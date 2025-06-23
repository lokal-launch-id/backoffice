import { Product } from '@/features/product/data/schema'

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '0a372866-773e-4ccb-b444-e5dde45f9ebb',
    user_id: '34a8d4b0-7669-4d3f-8917-fc62ca74b184',
    category_id: '4a2ea70d-c1d4-42bf-b5c6-2e92b55dbbb1',
    name_en: 'BizConnect',
    name_id: 'BizConnect',
    tagline: 'Business networking platform',
    description_en:
      'Business networking platform connecting entrepreneurs, investors, and professionals.',
    description_id:
      'Platform jaringan bisnis yang menghubungkan pengusaha, investor, dan profesional.',
    website_url: 'https://bizconnect.example.com',
    status: 'approved',
    total_claps: 30,
    total_comments: 3,
    created_at: '2025-06-05T20:51:20.91329+01:00',
    updated_at: '2025-06-20T09:23:24.327909+01:00',
    category: {
      id: '4a2ea70d-c1d4-42bf-b5c6-2e92b55dbbb1',
      name_en: 'Business',
      name_id: 'Bisnis',
      icon_url: '🏢',
      created_at: '2025-06-05T20:20:41.168523+01:00',
      updated_at: '2025-06-05T20:20:41.168523+01:00',
    },
    user: {
      id: '34a8d4b0-7669-4d3f-8917-fc62ca74b184',
      username: 'bizuser',
      first_name: 'Budi',
      last_name: 'Santoso',
      avatar_url: 'https://i.pravatar.cc/300',
      is_indonesian_maker: true,
    },
    is_featured: true,
    features: ['Networking', 'Investor Matching', 'Business Events'],
    tech_stack: ['React', 'Node.js', 'PostgreSQL'],
    pricing: 'Free tier available',
    user_clapped: false,
    user_claps: 0,
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    ],
  },
  {
    id: '1b483977-884f-5ddc-c555-f6eef56g0fcc',
    user_id: '45b9e5c1-8770-5e4g-9928-gd73db85ccc2',
    category_id: '5b3fb81e-d2e5-53cg-c6d7-3f03c66eccc2',
    name_en: 'TechFlow',
    name_id: 'TechFlow',
    tagline: 'Developer productivity tools',
    description_en:
      'Comprehensive suite of tools for developers to boost productivity and streamline workflows.',
    description_id:
      'Rangkaian lengkap alat untuk pengembang untuk meningkatkan produktivitas dan menyederhanakan alur kerja.',
    website_url: 'https://techflow.example.com',
    status: 'pending',
    total_claps: 15,
    total_comments: 1,
    created_at: '2025-06-10T15:30:10.12345+01:00',
    updated_at: '2025-06-15T12:45:30.654321+01:00',
    category: {
      id: '5b3fb81e-d2e5-53cg-c6d7-3f03c66eccc2',
      name_en: 'Technology',
      name_id: 'Teknologi',
      icon_url: '💻',
      created_at: '2025-06-05T20:20:41.168523+01:00',
      updated_at: '2025-06-05T20:20:41.168523+01:00',
    },
    user: {
      id: '45b9e5c1-8770-5e4g-9928-gd73db85ccc2',
      username: 'techdev',
      first_name: 'Sarah',
      last_name: 'Johnson',
      avatar_url: 'https://i.pravatar.cc/301',
      is_indonesian_maker: false,
    },
    is_featured: false,
    features: ['Code Review', 'CI/CD Integration', 'Team Collaboration'],
    tech_stack: ['TypeScript', 'Python', 'Docker'],
    pricing: 'Starting from $29/month',
    user_clapped: true,
    user_claps: 2,
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    ],
  },
]

// Mock API service
export class MockApiClient {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Simulate API response with delay
  private async simulateApiCall<T>(data: T, delayMs: number = 500): Promise<T> {
    await this.delay(delayMs)
    return data
  }

  // Get all products
  async getProducts(): Promise<Product[]> {
    return this.simulateApiCall(mockProducts)
  }

  // Get single product by ID
  async getProduct(id: string): Promise<Product> {
    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      throw new Error(`Product with ID ${id} not found`)
    }
    return this.simulateApiCall(product)
  }

  // Create new product
  async createProduct(
    productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `mock-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockProducts.push(newProduct)
    return this.simulateApiCall(newProduct)
  }

  // Update existing product
  async updateProduct(
    id: string,
    productData: Partial<Product>
  ): Promise<Product> {
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`)
    }

    const updatedProduct: Product = {
      ...mockProducts[index],
      ...productData,
      updated_at: new Date().toISOString(),
    }
    mockProducts[index] = updatedProduct
    return this.simulateApiCall(updatedProduct)
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`)
    }
    mockProducts.splice(index, 1)
    return this.simulateApiCall(undefined)
  }
}

// Export singleton instance
export const mockApiClient = new MockApiClient()
