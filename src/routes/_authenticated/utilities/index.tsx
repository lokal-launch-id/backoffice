import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/utilities/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>This is Utilities</div>
}
