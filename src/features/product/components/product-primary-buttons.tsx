import { IconPlus, IconEdit } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useProducts } from '../context/products-context'

interface ProductPrimaryButtonsProps {
  type?: 'add' | 'edit'
}

export function ProductPrimaryButtons({
  type = 'add',
}: ProductPrimaryButtonsProps) {
  const { setOpen, selectedProduct } = useProducts()

  if (type === 'edit') {
    return (
      <div className='flex gap-2'>
        <Button
          className='space-x-1'
          onClick={() => setOpen('edit')}
          disabled={!selectedProduct}
        >
          <span>Edit Product</span> <IconEdit size={18} />
        </Button>
      </div>
    )
  }

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Product</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
