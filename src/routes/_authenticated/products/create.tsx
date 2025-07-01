import { createFileRoute } from '@tanstack/react-router'
import ProductCreate from '@/features/product/components/create'

export const Route = createFileRoute('/_authenticated/products/create')({
  component: ProductCreate,
})
