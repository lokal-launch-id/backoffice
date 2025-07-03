import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { IconCheck, IconX, IconClock } from '@tabler/icons-react'
import { toast } from 'sonner'
import { API_ENDPOINTS, apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

const ProductDecisionOption: React.FC = () => {
  const { productId } = useParams({
    from: '/_authenticated/products/edit/$productId',
  })
  const navigate = useNavigate()

  const FormSchema = z.object({
    rejectReason: z.string().min(10, {
      message: 'Rejection reason must be at least 10 characters.',
    }),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function handleReject(data: z.infer<typeof FormSchema>) {
    await apiClient.patch(API_ENDPOINTS.products.updateStatus(productId), {
      status: 'rejected',
      reason: data.rejectReason,
    })
    toast.success('Product reject reason submitted')
    navigate({ to: `/products/detail/${productId}` })
  }

  const handleUpdateStatus = async (
    status: 'approved' | 'rejected' | 'pending'
  ) => {
    await apiClient.patch(API_ENDPOINTS.products.updateStatus(productId), {
      status,
    })
    toast.success(`Product status updated to ${status}`)
    navigate({ to: `/products/detail/${productId}` })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decision Management</CardTitle>
        <div className='text-muted-foreground text-sm'>
          Only admin role can do changes on this section.
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <Button
            onClick={() => handleUpdateStatus('approved')}
            className='w-full bg-green-600 hover:bg-green-700'
          >
            <IconCheck className='mr-2 h-4 w-4' />
            Approve Product
          </Button>

          <DropdownMenuSeparator />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleReject)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='rejectReason'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-md py-2 font-semibold'>
                      Rejection Reason
                    </FormLabel>
                    <FormDescription>
                      Explain why you reject this product, this will be shown to
                      the user. Use proper explanation and neutral tone.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder='Reason here'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className='w-full bg-red-600 hover:bg-red-700'>
                <IconX className='mr-2 h-4 w-4' /> Reject Product
              </Button>
            </form>
          </Form>

          <DropdownMenuSeparator />

          <Button
            onClick={() => handleUpdateStatus('pending')}
            className='mt-2 w-full bg-blue-500 hover:bg-blue-600'
          >
            <IconClock className='mr-2 h-4 w-4' /> Move to Pending
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductDecisionOption
