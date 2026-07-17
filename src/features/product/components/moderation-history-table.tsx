import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ProductModerationHistory } from '../api/products-api'

interface ModerationHistoryTableProps {
  items: ProductModerationHistory[]
  isLoading?: boolean
  error?: Error | null
  // Global log shows which product each decision belonged to; the per-product
  // view already knows, so it hides the column.
  showProduct?: boolean
}

function actionVariant(action: string): 'default' | 'destructive' | 'secondary' {
  switch (action) {
    case 'approved':
      return 'default'
    case 'rejected':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export function ModerationHistoryTable({
  items,
  isLoading,
  error,
  showProduct = false,
}: ModerationHistoryTableProps) {
  if (isLoading) {
    return (
      <div className='text-muted-foreground py-6 text-center text-sm'>
        Loading moderation history...
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-6 text-center text-sm text-red-500'>
        Failed to load moderation history.
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className='text-muted-foreground py-6 text-center text-sm'>
        No moderation history yet.
      </div>
    )
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            {showProduct && <TableHead>Product</TableHead>}
            <TableHead>Reason</TableHead>
            <TableHead>Moderator</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((h) => (
            <TableRow key={h.id}>
              <TableCell>
                <Badge variant={actionVariant(h.action)}>{h.action}</Badge>
              </TableCell>
              {showProduct && (
                <TableCell className='font-mono text-xs'>
                  {h.product_id.slice(0, 8)}
                </TableCell>
              )}
              <TableCell className='max-w-xs truncate'>
                {h.reason || (
                  <span className='text-muted-foreground'>—</span>
                )}
              </TableCell>
              <TableCell className='font-mono text-xs'>
                {h.admin_id.slice(0, 8)}
              </TableCell>
              <TableCell className='whitespace-nowrap'>
                {format(new Date(h.created_at), 'yyyy-MM-dd HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
