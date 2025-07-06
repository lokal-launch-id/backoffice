import { IconAlertTriangle } from '@tabler/icons-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Clap } from '../data/schema'
import { useSetClapToZero } from '../hooks/use-claps'

interface ClapSetZeroDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clap: Clap
}

export function ClapSetZeroDialog({
  open,
  onOpenChange,
  clap,
}: ClapSetZeroDialogProps) {
  const setClapToZeroMutation = useSetClapToZero()

  const handleSetToZero = () => {
    setClapToZeroMutation.mutate(clap.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleSetToZero}
      isLoading={setClapToZeroMutation.isPending}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />
          Set Clap to Zero
        </span>
      }
      desc={
        <div className='space-y-2'>
          <p>
            Are you sure you want to set the clap count to zero for the product{' '}
            <span className='font-bold'>{clap.product.name_en}</span>?
          </p>
          <p className='text-sm text-gray-600'>
            Current clap count:{' '}
            <span className='font-semibold'>{clap.clap_count}</span>
          </p>
          <p className='text-sm text-red-600'>This action cannot be undone.</p>
        </div>
      }
      confirmText='Set to Zero'
      destructive
    />
  )
}
