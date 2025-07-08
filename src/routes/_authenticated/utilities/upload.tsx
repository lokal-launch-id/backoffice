import { createFileRoute } from '@tanstack/react-router'
import UploadPage from '@/features/utilities/components/upload-page'

export const Route = createFileRoute('/_authenticated/utilities/upload')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UploadPage />
}
