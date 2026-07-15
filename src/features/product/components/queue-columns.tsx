import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { ProductQueueItem } from '../api/products-api'

function QueueProductNameCell({ item }: { item: ProductQueueItem }) {
  return (
    <Link
      to='/products/detail/$productId'
      params={{ productId: item.id }}
      className='text-blue-600 hover:underline'
    >
      {item.name_en}
    </Link>
  )
}

// Rendered as plain text rather than a link: there is no per-user detail route,
// only the /users list. This used to point at /users/detail/$userId, which has
// never existed.
function QueueUserIdCell({ item }: { item: ProductQueueItem }) {
  return <span className='font-mono text-xs'>{item.user_id}</span>
}

export const queueColumns: ColumnDef<ProductQueueItem>[] = [
  {
    accessorKey: 'name_en',
    header: 'Product Name',
    cell: ({ row }) => <QueueProductNameCell item={row.original} />,
    meta: { className: '' },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => format(new Date(row.original.created_at), 'yyyy-MM-dd'),
    meta: { className: '' },
  },
  {
    accessorKey: 'user_id',
    header: 'User ID',
    cell: ({ row }) => <QueueUserIdCell item={row.original} />,
    meta: { className: '' },
  },
  {
    accessorKey: 'days_in_queue',
    header: 'Days in Queue',
    cell: ({ row }) =>
      `${row.original.days_in_queue} day${row.original.days_in_queue !== 1 ? 's' : ''} in queue`,
    meta: { className: '' },
  },
]
