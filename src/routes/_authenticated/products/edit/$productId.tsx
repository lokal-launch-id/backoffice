import { createFileRoute } from '@tanstack/react-router'
import ProductsEdit from '@/features/product/edit'

export const Route = createFileRoute(
  '/_authenticated/products/edit/$productId'
)({
  component: ProductsEdit,
})
