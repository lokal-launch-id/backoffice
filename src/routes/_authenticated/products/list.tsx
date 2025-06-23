import { createFileRoute } from '@tanstack/react-router'
import Products from '@/features/product'

export const Route = createFileRoute('/_authenticated/products/list')({
  component: Products,
})
