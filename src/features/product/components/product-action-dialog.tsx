import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Product, productStatusSchema } from '../data/schema'

const formSchema = z.object({
  name_en: z.string().min(1, { message: 'Name (EN) is required.' }),
  name_id: z.string().min(1, { message: 'Name (ID) is required.' }),
  status: productStatusSchema,
  is_featured: z.boolean(),
  created_at: z.string().nullable(),
  user: z.object({
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    username: z.string().min(1, { message: 'Username is required.' }),
  }),
})
type ProductForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const currentRowData: ProductForm = {
    created_at: currentRow?.created_at ?? null,
    name_en: currentRow?.name_en ?? '',
    name_id: currentRow?.name_id ?? '',
    status: currentRow?.status ?? 'pending',
    is_featured: currentRow?.is_featured ?? false,
    user: {
      first_name: currentRow?.user?.first_name ?? '',
      last_name: currentRow?.user?.last_name ?? '',
      username: currentRow?.user?.username ?? '',
    },
  }
  const form = useForm<ProductForm, unknown, ProductForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? currentRowData
      : {
          created_at: '',
          name_en: '',
          name_id: '',
          status: 'pending',
          is_featured: false,
          user: { first_name: '', last_name: '', username: '' },
        },
  })

  const onSubmit = (values: ProductForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the product here. ' : 'Create new product here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='product-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name_en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (EN)</FormLabel>
                    <FormControl>
                      <Input placeholder='Product Name (EN)' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (ID)</FormLabel>
                    <FormControl>
                      <Input placeholder='Product Name (ID)' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input placeholder='Status' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='is_featured'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured</FormLabel>
                    <FormControl>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='user.first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maker First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='First Name'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='user.last_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maker Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Last Name'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='user.username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maker Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit'>Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
