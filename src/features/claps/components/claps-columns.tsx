import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { IconNumber0, IconMinus, IconCopy, IconPlus } from '@tabler/icons-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Clap } from '../data/schema'
import { useClaps } from '../stores/clapsStore'

// Copy to clipboard function
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here if needed
  } catch {
    // Fallback: use deprecated execCommand if clipboard API fails
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

// Action buttons component
function ClapActionButtons({ clap }: { clap: Clap }) {
  const { setOpen, setCurrentClap } = useClaps()
  const { user } = useAuthStore()

  const isAdmin = user?.role === 'admin'

  const handleSetToZero = () => {
    setCurrentClap(clap)
    setOpen('setToZero')
  }

  const handleReduce = () => {
    setCurrentClap(clap)
    setOpen('reduce')
  }

  const handleIncrement = () => {
    setCurrentClap(clap)
    setOpen('increment')
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='destructive'
        size='sm'
        onClick={handleSetToZero}
        disabled={!isAdmin}
        className='h-8'
      >
        <IconNumber0 className='mr-1 h-4 w-4' />
        Set to Zero
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={handleReduce}
        disabled={!isAdmin}
        className='h-8 border-gray-300 text-gray-600 hover:bg-gray-50'
      >
        <IconMinus className='mr-1 h-4 w-4' />
        Reduce
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={handleIncrement}
        disabled={!isAdmin}
        className='h-8 border-green-300 text-green-600 hover:bg-green-50'
      >
        <IconPlus className='mr-1 h-4 w-4' />
        Increment By
      </Button>
    </div>
  )
}

export const clapsColumns: ColumnDef<Clap>[] = [
  {
    accessorKey: 'id',
    header: 'Clap ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      return (
        <div className='flex items-center gap-2'>
          <span className='font-mono text-sm'>{id.slice(0, 8)}...</span>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => copyToClipboard(id)}
            className='h-6 w-6 p-0 hover:bg-gray-100'
          >
            <IconCopy className='h-3 w-3' />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: 'clap_count',
    header: 'Clap Count',
    cell: ({ row }) => {
      const count = row.getValue('clap_count') as number
      return <span className='font-semibold'>{count}</span>
    },
  },
  {
    accessorKey: 'product.name_en',
    header: 'Product Name',
    cell: ({ row }) => {
      const productName = row.original.product.name_en
      return <span className='font-medium'>{productName}</span>
    },
  },
  {
    accessorKey: 'user_id',
    header: 'User ID',
    cell: ({ row }) => {
      const userId = row.original.user_id
      return userId ? (
        <div className='flex items-center gap-2'>
          <span className='font-mono text-sm'>{userId.slice(0, 8)}...</span>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => copyToClipboard(userId)}
            className='h-6 w-6 p-0 hover:bg-gray-100'
          >
            <IconCopy className='h-3 w-3' />
          </Button>
        </div>
      ) : (
        <span className='text-gray-400'>N/A</span>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Clap Time',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return <span>{format(new Date(date), 'MMM dd, yyyy HH:mm')}</span>
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ClapActionButtons clap={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
