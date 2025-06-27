import { createFileRoute } from '@tanstack/react-router'
import Pro from '@/features/settings/profile'

export const Route = createFileRoute('/_authenticated/products/create')({
  component: Pro,
})
