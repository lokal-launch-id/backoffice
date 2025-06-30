import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconMail, IconTrash } from '@tabler/icons-react'
import { useAuth } from '@/stores/authStore'
import { useUsers } from '@/stores/usersStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpenDialog, setCurrentRow, resendVerificationEmail } = useUsers()
  const { user } = useAuth()
  console.log(user, 'current user')
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-16 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpenDialog('edit')
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={row.original.is_verified}
            onClick={() => {
              setCurrentRow(row.original)
              resendVerificationEmail(row.original.email)
            }}
          >
            Resend Verification
            <DropdownMenuShortcut>
              <IconMail size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          {user?.role === 'admin' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={user?.id === row.original.id}
                onClick={() => {
                  setCurrentRow(row.original)
                  setOpenDialog('delete')
                }}
                className='text-red-500!'
              >
                Delete
                <DropdownMenuShortcut>
                  <IconTrash size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
