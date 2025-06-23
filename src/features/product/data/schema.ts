import { z } from 'zod'

export const productStatusSchema = z.union([
  z.literal('approved'),
  z.literal('pending'),
  z.literal('rejected'),
])
export type ProductStatus = z.infer<typeof productStatusSchema>

// const userSchema = z.object({
//   id: z.string(),
//   firstName: z.string(),
//   lastName: z.string(),
//   username: z.string(),
//   email: z.string(),
//   phoneNumber: z.string(),
//   status: productStatusSchema,
//   role: userRoleSchema,
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
// })
// export type User = z.infer<typeof userSchema>

// export const userListSchema = z.array(userSchema)

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
  images?: string[]
}
