import { IconMailPlus, IconUserPlus } from '@tabler/icons-react'
import { useUsers } from '@/stores/usersStore'
import { Button } from '@/components/ui/button'

export function UsersPrimaryButtons() {
  const { setOpenDialog } = useUsers()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpenDialog('invite')}
      >
        <span>Invite User</span> <IconMailPlus size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpenDialog('add')}>
        <span>Add User</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
