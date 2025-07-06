import { z } from 'zod'

// Clap sort options
export const clapSortSchema = z.enum(['newest', 'oldest', 'most_clapped'])
export type ClapSort = z.infer<typeof clapSortSchema>

// Product data within clap
export const clapProductSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_id: z.string(),
  tagline: z.string(),
})
export type ClapProduct = z.infer<typeof clapProductSchema>

// Main clap schema
export const clapSchema = z.object({
  id: z.string(),
  clap_count: z.number(),
  product: clapProductSchema,
  user_id: z.string().optional(), // Will need to add this to API response
  created_at: z.string(),
})
export type Clap = z.infer<typeof clapSchema>

// API response schema
export const clapsResponseSchema = z.object({
  data: z.array(clapSchema),
  meta: z.object({
    current_page: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
    items_per_page: z.number(),
  }),
})
export type ClapsResponse = z.infer<typeof clapsResponseSchema>

// Pagination parameters
export const paginationParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort: clapSortSchema.default('newest'),
})
export type PaginationParams = z.infer<typeof paginationParamsSchema>

// Clap action schemas
export const setClapToZeroSchema = z.object({
  set_to_zero: z.literal(true),
})
export type SetClapToZero = z.infer<typeof setClapToZeroSchema>

export const reduceClapSchema = z.object({
  reduce_by: z.number().min(1),
})
export type ReduceClap = z.infer<typeof reduceClapSchema>

export const incrementClapSchema = z.object({
  increment_by: z.number().min(1),
})

export type IncrementClap = z.infer<typeof incrementClapSchema>
