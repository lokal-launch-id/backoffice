import { useNavigate } from '@tanstack/react-router'
import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export function CategoriesPrimaryButtons() {
  const navigate = useNavigate()

  return (
    <div className='flex gap-2'>
      <Button
        className='space-x-1'
        onClick={() => navigate({ to: '/categories/create' })}
      >
        <span>Add Category</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
