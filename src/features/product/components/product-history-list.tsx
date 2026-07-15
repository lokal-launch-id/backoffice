import { useParams } from '@tanstack/react-router'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useModerationHistory } from '../hooks/use-products'

export function ProductHistoryList() {
  const { productId } = useParams({
    from: '/_authenticated/products/edit/$productId',
  })
  const { data, isLoading, error } = useModerationHistory(productId)

  // The API already returns newest first.
  const newest = (data?.data ?? []).slice(0, 3)

  return (
    <Card>
      <CardTitle className='px-6 pb-2 text-base'>Moderation History</CardTitle>
      <CardContent className='flex flex-col gap-2 space-y-2'>
        {isLoading ? (
          <>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </>
        ) : error ? (
          <div className='text-muted-foreground text-sm'>
            Could not load moderation history.
          </div>
        ) : newest.length === 0 ? (
          <div className='text-muted-foreground text-sm'>
            No decisions recorded yet.
          </div>
        ) : (
          newest.map((history) => (
            <div key={history.id} className='text-sm'>
              <span className='font-medium capitalize'>{history.action}</span>{' '}
              &middot;{' '}
              <span className='text-muted-foreground text-xs'>
                {new Date(history.created_at).toLocaleString()}
              </span>
              {history.reason && (
                <div className='text-muted-foreground text-xs'>
                  Reason: {history.reason}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
