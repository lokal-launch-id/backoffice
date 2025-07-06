import { createFileRoute } from '@tanstack/react-router'
import ClapModeration from '@/features/claps/moderation'

export const Route = createFileRoute('/_authenticated/claps/')({
  component: ClapModeration,
})
