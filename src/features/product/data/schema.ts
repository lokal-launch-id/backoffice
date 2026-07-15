import { z } from 'zod'
import { User } from '@/features/users/data/schema'

// Must mirror models.ProductStatus in the API. "resubmitted" is set when a
// maker edits a product that was rejected; leaving it out made those rows fail
// to parse.
export const productStatusSchema = z.union([
  z.literal('approved'),
  z.literal('pending'),
  z.literal('rejected'),
  z.literal('resubmitted'),
])
export type ProductStatus = z.infer<typeof productStatusSchema>

export const productFormSchema = z.object({
  name_en: z
    .string()
    .min(3, { message: 'Name (EN) must be at least 3 characters.' })
    .max(100, { message: 'Name (EN) must be at most 100 characters.' }),
  name_id: z
    .string()
    .min(3, { message: 'Name (ID) must be at least 3 characters.' })
    .max(100, { message: 'Name (ID) must be at most 100 characters.' }),
  tagline: z
    .string()
    .min(10, { message: 'Tagline must be at least 10 characters.' })
    .max(200, { message: 'Tagline must be at most 200 characters.' }),
  description_en: z
    .string()
    .min(50, { message: 'Description (EN) must be at least 50 characters.' })
    .max(2000, { message: 'Description (EN) must be at most 2000 characters.' })
    .refine(
      (val) => !/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(val),
      { message: 'Description (EN) must not contain an email address.' }
    ),
  description_id: z
    .string()
    .min(50, { message: 'Description (ID) must be at least 50 characters.' })
    .max(2000, { message: 'Description (ID) must be at most 2000 characters.' })
    .refine(
      (val) => !/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(val),
      { message: 'Description (ID) must not contain an email address.' }
    ),
  website_url: z.string().url({ message: 'Please enter a valid URL.' }),
  status: productStatusSchema,
  is_featured: z.boolean(),
  features: z
    .array(
      z
        .string()
        .min(5, { message: 'Each feature must be at least 5 characters.' })
        .max(100, { message: 'Each feature must be at most 100 characters.' })
    )
    .max(20, { message: 'You can add up to 20 features.' }),
  tech_stack: z
    .array(
      z
        .string()
        .min(2, {
          message: 'Each tech stack item must be at least 2 characters.',
        })
        .max(50, {
          message: 'Each tech stack item must be at most 50 characters.',
        })
    )
    .max(15, { message: 'You can add up to 15 tech stack items.' }),
  pricing: z
    .string()
    .max(100, { message: 'Pricing must be at most 100 characters.' })
    .optional(),
  images: z.array(
    z.object({
      id: z.string(),
      product_id: z.string(),
      image_url: z.string(),
      order_index: z.number(),
      created_at: z.string(),
    })
  ),
  launch_date: z.date().optional(),
  category_id: z.string().optional(),
  category: z.string().optional(),
})

export type ProductFormData = z.infer<typeof productFormSchema>

export type ProductImage = {
  id: string
  product_id: string
  image_url: string
  order_index: number
  created_at: string
}

type UploadImageType = 'avatar' | 'product' | 'general'

export interface UploadImage {
  file: File
  type: UploadImageType
}

export interface Category {
  id: string
  name_en: string
  name_id: string
  icon_url: string
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
  category: Category
  user: Partial<User>
  is_featured: boolean
  features: string[]
  tech_stack: string[]
  pricing: string
  user_clapped: boolean
  user_claps: number
  logo_url: string
  images?: ProductImage[]
  launch_date: Date
}
