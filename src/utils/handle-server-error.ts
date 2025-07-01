import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error)

  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'Content not found.'
  }

  if (error instanceof AxiosError) {
    errMsg =
      error.response?.data.title || error.response?.data.error || error.message
  } else if (error instanceof Error) {
    // Handle regular Error objects (from fetch API)
    errMsg = error.message
  }

  toast.error(errMsg)
}
