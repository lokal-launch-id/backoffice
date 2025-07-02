import { useParams } from '@tanstack/react-router'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

// TypeScript type for ProductModerationHistory
export type ProductModerationHistory = {
  id: string
  product_id: string
  admin_id: string
  action: string
  reason: string
  created_at: string // ISO string for simplicity
}

// Mock data for demonstration
const mockHistory: ProductModerationHistory[] = [
  {
    id: '1',
    product_id: 'prod-1',
    admin_id: 'admin-1',
    action: 'approved',
    reason: 'Meets all requirements',
    created_at: '2024-06-01T10:00:00Z',
  },
  {
    id: '2',
    product_id: 'prod-1',
    admin_id: 'admin-2',
    action: 'rejected',
    reason: 'Insufficient description',
    created_at: '2024-05-28T15:30:00Z',
  },
  {
    id: '3',
    product_id: 'prod-1',
    admin_id: 'admin-3',
    action: 'pending',
    reason: 'Waiting for review',
    created_at: '2024-05-25T09:20:00Z',
  },
  {
    id: '4',
    product_id: 'prod-1',
    admin_id: 'admin-4',
    action: 'rejected',
    reason: 'Spam',
    created_at: '2024-06-02T09:00:00Z',
  },
]

export function ProductHistoryList() {
  const { productId } = useParams({
    from: '/_authenticated/products/edit/$productId',
  })
  

  const newest = [...mockHistory]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3)

  return (
    <Card>
      <CardTitle className='px-6 pb-2 text-base'>Moderation History</CardTitle>
      <CardContent className='flex flex-col gap-2 space-y-2'>
        {newest.map((history) => (
          <div key={history.id} className='text-sm'>
            <span className='font-medium capitalize'>{history.action}</span>{' '}
            &middot;{' '}
            <span className='text-muted-foreground text-xs'>
              {new Date(history.created_at).toLocaleString()}
            </span>
            {history.action !== 'approved' && history.reason && (
              <div className='text-muted-foreground text-xs'>
                Reason: {history.reason}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
