import { IconEyeOff } from '@tabler/icons-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useProductDecision } from '../hooks/use-products'
import { Product } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Product
}

/**
 * Takes a listing off the public site, or puts a hidden one back.
 *
 * This is the seeding workflow's cleanup step. A curator seeds the directory so
 * it is not empty at launch; when the real maker submits their own version, the
 * seeded copy has to stop being public. Hiding rather than deleting keeps the
 * claps and the record, and is reversible if the maker changes their mind.
 *
 * Unlike delete, there is no type-the-name confirmation: hiding is undone by
 * pressing the same button again, so guarding it that heavily would only slow
 * down the one action a curator does repeatedly.
 */
export function ProductHideDialog({ open, onOpenChange, currentRow }: Props) {
  const decide = useProductDecision()
  const isHidden = currentRow.status === 'hidden'

  const handleConfirm = () => {
    decide.mutate(
      {
        id: currentRow.id,
        // Republishing goes straight back to approved rather than through
        // pending: a moderator already approved this listing once, and the
        // owner-facing /republish route is the one that re-verifies.
        data: { status: isHidden ? 'approved' : 'hidden' },
      },
      {
        onSuccess: () => {
          toast.success(
            isHidden
              ? `${currentRow.name_en} is public again`
              : `${currentRow.name_en} is hidden from the site`
          )
          onOpenChange(false)
        },
        onError: (error: unknown) => {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Could not change the product visibility'
          )
        },
      }
    )
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      isLoading={decide.isPending}
      title={
        <span>
          <IconEyeOff className='mr-1 inline-block' size={18} />{' '}
          {isHidden ? 'Publish Product' : 'Hide Product'}
        </span>
      }
      desc={
        <p>
          {isHidden ? (
            <>
              Put <span className='font-bold'>{currentRow.name_en}</span> back on
              the public site. It returns as approved, without going through the
              moderation queue again.
            </>
          ) : (
            <>
              Remove <span className='font-bold'>{currentRow.name_en}</span> from
              the public site. Claps and comments are kept, and you can publish
              it again at any time.
            </>
          )}
        </p>
      }
      confirmText={isHidden ? 'Publish' : 'Hide'}
    />
  )
}
