import { createFileRoute } from '@tanstack/react-router'
import ModerationLog from '@/features/product/components/moderation-log'

export const Route = createFileRoute('/_authenticated/products/moderation-log')(
  {
    component: RouteComponent,
  }
)

function RouteComponent() {
  return <ModerationLog />
}
