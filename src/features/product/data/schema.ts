import { z } from 'zod'

export const productStatusSchema = z.union([
  z.literal('approved'),
  z.literal('pending'),
  z.literal('rejected'),
])
export type ProductStatus = z.infer<typeof productStatusSchema>

export const productFormSchema = z.object({
  name_en: z.string().min(1, { message: 'Name (EN) is required.' }),
  name_id: z.string().min(1, { message: 'Name (ID) is required.' }),
  tagline: z.string().min(1, { message: 'Tagline is required.' }),
  description_en: z
    .string()
    .min(1, { message: 'Description (EN) is required.' }),
  description_id: z
    .string()
    .min(1, { message: 'Description (ID) is required.' }),
  website_url: z.string().url({ message: 'Please enter a valid URL.' }),
  status: productStatusSchema,
  is_featured: z.boolean(),
  features: z.array(z.string()),
  tech_stack: z.array(z.string()),
  pricing: z.string().optional(),
  images: z.array(
    z.object({
      id: z.string(),
      product_id: z.string(),
      image_url: z.string(),
      order_index: z.number(),
      created_at: z.string(),
    })
  ),
})

export type ProductFormData = z.infer<typeof productFormSchema>

// export const userListSchema = z.array(userSchema)
export type ProductImage = {
  id: string
  product_id: string
  image_url: string
  order_index: number
  created_at: string
}

export interface Product {
  id: string
  user_id: string
  category_id: string
  name_en: string
  name_id: string
  tagline: string
  description_en: string
  description_id: string
  website_url: string
  status: ProductStatus
  total_claps: number
  total_comments: number
  created_at: string
  updated_at: string
  category: {
    id: string
    name_en: string
    name_id: string
    icon_url: string
    created_at: string
    updated_at: string
  }
  user: {
    id: string
    username: string
    first_name: string | null
    last_name: string | null
    avatar_url: string
    is_indonesian_maker: boolean
  }
  is_featured: boolean
  features: string[]
  tech_stack: string[]
  pricing: string
  user_clapped: boolean
  user_claps: number
  images?: ProductImage[]
}
