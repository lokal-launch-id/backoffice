import { createFileRoute } from '@tanstack/react-router'
import CategoriesCreate from '@/features/categories/components/create'

export const Route = createFileRoute('/_authenticated/categories/create')({
  component: CategoriesCreate,
})
