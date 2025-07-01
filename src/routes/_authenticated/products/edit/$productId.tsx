import { createFileRoute } from '@tanstack/react-router'
import ProductsEdit from '@/features/product/components/edit'

export const Route = createFileRoute(
  '/_authenticated/products/edit/$productId'
)({
  component: ProductsEdit,
})
