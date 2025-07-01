import { useNavigate } from '@tanstack/react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useProducts } from '../stores/productsStore'

interface ProductPrimaryButtonsProps {
  type?: 'add' | 'edit'
}

export function ProductPrimaryButtons({
  type = 'add',
}: ProductPrimaryButtonsProps) {
  const { setOpen, selectedProduct } = useProducts()
  const navigate = useNavigate()

  if (type === 'edit') {
    return (
      <div className='flex gap-2'>
        <Button
          className='space-x-1'
          onClick={() => {
            if (selectedProduct) {
              navigate({
                to: '/products/edit/$productId',
                params: { productId: selectedProduct.id },
              })
            }
          }}
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
