import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_id: z.string(),
  icon_url: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Category = z.infer<typeof categorySchema>

export const categoryFormSchema = z.object({
  name_en: z
    .string()
    .min(3, { message: 'Name (EN) must be at least 3 characters.' })
    .max(100, { message: 'Name (EN) must be at most 100 characters.' }),
  name_id: z
    .string()
    .min(3, { message: 'Name (ID) must be at least 3 characters.' })
    .max(100, { message: 'Name (ID) must be at most 100 characters.' }),
  icon_url: z
    .string()
    .min(1, { message: 'Icon is required.' })
    .max(10, { message: 'Icon must be at most 10 characters.' }),
})

export type CategoryFormData = z.infer<typeof categoryFormSchema>
