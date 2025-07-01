import { createFileRoute } from '@tanstack/react-router'
import ProductsDetail from '@/features/product/components/detail'

export const Route = createFileRoute('/_authenticated/products/detail')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProductsDetail />
}
