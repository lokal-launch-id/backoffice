import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: () => {
    const accessToken = useAuthStore.getState().accessToken
    if (!accessToken) {
      throw redirect({ to: '/sign-in' })
    }
  },
})
