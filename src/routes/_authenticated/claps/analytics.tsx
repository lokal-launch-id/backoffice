import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/coming-soon'

export const Route = createFileRoute('/_authenticated/claps/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ComingSoon />
}
