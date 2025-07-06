import { createFileRoute } from '@tanstack/react-router'
import ProductQueue from '@/features/product/components/queue'

export const Route = createFileRoute('/_authenticated/products/queue')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProductQueue />
}
