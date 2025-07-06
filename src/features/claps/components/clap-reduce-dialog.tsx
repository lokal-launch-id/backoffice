import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconMinus } from '@tabler/icons-react'
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
import { Clap } from '../data/schema'
import { useReduceClap } from '../hooks/use-claps'

const formSchema = z.object({
  reduceBy: z
    .number()
    .min(1, 'Must be at least 1')
    .max(1000, 'Cannot exceed 1000'),
})

type FormValues = z.infer<typeof formSchema>

interface ClapReduceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clap: Clap
}

export function ClapReduceDialog({
  open,
  onOpenChange,
  clap,
}: ClapReduceDialogProps) {
  const reduceClapMutation = useReduceClap()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reduceBy: undefined,
    },
  })

  const handleSubmit = (values: FormValues) => {
    const maxReduce = clap.clap_count
    if (values.reduceBy > maxReduce) {
      form.setError('reduceBy', {
        message: `Cannot reduce more than current clap count (${maxReduce})`,
      })
      return
    }

    reduceClapMutation.mutate(
      { clapId: clap.id, reduceBy: values.reduceBy },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      }
    )
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <IconMinus className='h-5 w-5' />
            Reduce Clap Count
          </DialogTitle>
          <DialogDescription>
            Reduce the clap count for{' '}
            <span className='font-medium'>{clap.product.name_en}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <div className='text-sm text-gray-600'>
                Current clap count:{' '}
                <span className='font-semibold'>{clap.clap_count}</span>
              </div>

              <FormField
                control={form.control}
                name='reduceBy'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reduce by</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter amount to reduce'
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(
                            value === '' ? undefined : parseInt(value, 10)
                          )
                        }}
                        value={field.value ?? ''}
                        min='1'
                        max={clap.clap_count}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
                disabled={reduceClapMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='destructive'
                disabled={reduceClapMutation.isPending}
              >
                {reduceClapMutation.isPending ? 'Reducing...' : 'Reduce Claps'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
