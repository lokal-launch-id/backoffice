import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteProduct } from '../hooks/use-products'
import { Product } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Product
}

/**
 * Permanently deletes a product.
 *
 * Every table that references a product does so with ON DELETE CASCADE, so this
 * takes the claps, comments, images and the moderation history with it. The
 * record of who approved or rejected the listing disappears too, which is why
 * the warning says so and why only admins get through: the API rejects
 * moderators here, and hiding is the reversible alternative.
 *
 * Typing the product name is the guard. It exists because the destructive
 * action and the harmless one sit next to each other in the same row menu, and
 * the rows differ only by name.
 */
export function ProductDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')
  const deleteProduct = useDeleteProduct()
  const nameMatches = value.trim() === currentRow.name_en

  const handleDelete = () => {
    if (!nameMatches) return

    deleteProduct.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`${currentRow.name_en} has been deleted`)
        setValue('')
        onOpenChange(false)
      },
      onError: (error: unknown) => {
        // The API returns 403 when the caller is neither the owner nor an
        // admin. Surfacing the real message rather than a generic failure is
        // what tells a moderator to hide it instead.
        toast.error(
          error instanceof Error ? error.message : 'Could not delete the product'
        )
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={!nameMatches || deleteProduct.isPending}
      isLoading={deleteProduct.isPending}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          Delete Product
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name_en}</span>?
          </p>
          <Alert variant='destructive'>
            <AlertTitle>This cannot be undone</AlertTitle>
            <AlertDescription>
              Deleting also removes every clap, comment and image on this
              product, and the moderation history that records who approved or
              rejected it. To take a listing off the public site without losing
              any of that, use Hide instead.
            </AlertDescription>
          </Alert>
          <Label className='my-2'>
            Type the product name to confirm:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={currentRow.name_en}
            />
          </Label>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
