import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { Category } from '../data/schema'

export const categoriesColumns: ColumnDef<Category>[] = [
  {
    accessorKey: 'icon_url',
    header: 'Icon',
    cell: ({ row }) => {
      const category = row.original
      return <span className='text-2xl'>{category.icon_url}</span>
    },
    meta: { className: 'text-center' },
  },
  {
    accessorKey: 'name_en',
    header: 'Name (EN)',
    cell: ({ row }) => {
      const category = row.original
      return <span className='text-blue-600'>{category.name_en}</span>
    },
    meta: { className: '' },
  },
  {
    accessorKey: 'name_id',
    header: 'Name (ID)',
    cell: ({ row }) => {
      const category = row.original
      return <span>{category.name_id}</span>
    },
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
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => {
      const date = row.original.updated_at
      return format(new Date(date), 'yyyy-MM-dd')
    },
    meta: { className: '' },
  },
]
