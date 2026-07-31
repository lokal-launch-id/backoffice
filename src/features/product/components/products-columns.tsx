import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { Product } from '../data/schema'
import { useProducts } from '../stores/productsStore'
import { DataTableRowActions } from './data-table-row-actions'

// Separate component to use React hooks
function ProductNameCell({ product }: { product: Product }) {
  const { setSelectedProductId } = useProducts()

  return (
    <Link
      to='/products/detail/$productId'
      params={{ productId: product.id }}
      className='text-blue-600 hover:underline'
      onClick={() => setSelectedProductId(product.id)}
    >
      {product.name_en}
    </Link>
  )
}

export const productsColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name_en',
    header: 'Name (EN)',
    cell: ({ row }) => {
      const product = row.original
      return <ProductNameCell product={product} />
    },
    meta: { className: '' },
  },
  {
    accessorKey: 'name_id',
    header: 'Name (ID)',
    cell: ({ row }) => {
      const product = row.original
      return <span>{product.name_id}</span>
    },
    meta: { className: '' },
  },
  {
    id: 'maker',
    header: 'Maker Name',
    cell: ({ row }) => {
      const user = row.original.user
      if (user.first_name || user.last_name) {
        return `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
      }
      return user.username
    },
    meta: { className: '' },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    // Same as the queue: the faceted filter hands over an array of selected
    // values, which the default matcher cannot compare against a string.
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    meta: { className: '' },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.original.created_at
      return format(new Date(date), 'yyyy-MM-dd')
    },
    meta: { className: '' },
  },
  {
    accessorKey: 'is_featured',
    header: 'Featured',
    cell: ({ row }) =>
      row.original.is_featured ? (
        <span title='Featured'>⭐</span>
      ) : (
        <span title='Not Featured'>—</span>
      ),
    meta: { className: 'text-center' },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
    // py-0 matters: TableCell is p-2 and the menu trigger is h-8, so with the
    // default padding this cell is 48px against ~36px for the text cells and
    // every row in the table grows to match it. Dropping the vertical padding
    // lets the button set the height without adding to it.
    meta: { className: 'w-12 py-0' },
  },
]
