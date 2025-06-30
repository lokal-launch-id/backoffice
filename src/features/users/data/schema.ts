import * as z from 'zod/v4'

const userRoleSchema = z.union([
  z.literal('admin'),
  z.literal('moderator'),
  z.literal('user'),
])

const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  bio: z.string().nullable(),
  avatar_url: z.string().nullable(),
  is_indonesian_maker: z.boolean(),
  is_verified: z.boolean(),
  role: userRoleSchema,
  created_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)

// API response schema with pagination
const paginationMetaSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
  items_per_page: z.number(),
})

export const userListResponseSchema = z.object({
  data: userListSchema,
  meta: paginationMetaSchema,
})

export type UserListResponse = z.infer<typeof userListResponseSchema>
