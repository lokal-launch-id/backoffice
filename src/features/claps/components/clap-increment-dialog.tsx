import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus } from '@tabler/icons-react'
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
import { useIncrementClap } from '../hooks/use-claps'

const formSchema = z.object({
  incrementBy: z
    .number()
    .min(1, 'Must be at least 1')
    .max(1000, 'Cannot exceed 1000'),
})

type FormValues = z.infer<typeof formSchema>

interface ClapIncrementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clap: Clap
}

export function ClapIncrementDialog({
  open,
  onOpenChange,
  clap,
}: ClapIncrementDialogProps) {
  const incrementClapMutation = useIncrementClap()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const handleSubmit = (values: FormValues) => {
    incrementClapMutation.mutate(
      { clapId: clap.id, incrementBy: values.incrementBy },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <IconPlus className='h-5 w-5' />
            Increment Clap Count
          </DialogTitle>
          <DialogDescription>
            Increment the clap count for{' '}
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
                name='incrementBy'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Increment by</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter amount to increment'
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(
                            value === '' ? undefined : parseInt(value, 10)
                          )
                        }}
                        value={field.value ?? ''}
                        min='1'
                        max='1000'
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
                disabled={incrementClapMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='default'
                disabled={incrementClapMutation.isPending}
                className='bg-green-600 hover:bg-green-700'
              >
                {incrementClapMutation.isPending
                  ? 'Incrementing...'
                  : 'Increment Claps'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
