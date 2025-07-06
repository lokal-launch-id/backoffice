import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/claps/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/claps/analytics"!</div>
}
