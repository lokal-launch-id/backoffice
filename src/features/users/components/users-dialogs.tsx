import { useUsers } from '@/stores/usersStore'
import { UsersActionDialog } from './users-action-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
import { UsersInviteDialog } from './users-invite-dialog'

export function UsersDialogs() {
  const { openDialog, setOpenDialog, currentRow, setCurrentRow } = useUsers()
  return (
    <>
      <UsersActionDialog
        key='user-add'
        open={openDialog === 'add'}
        onOpenChange={(open) => {
          setOpenDialog(open ? 'add' : null)
        }}
      />

      <UsersInviteDialog
        key='user-invite'
        open={openDialog === 'invite'}
        onOpenChange={(open) => {
          setOpenDialog(open ? 'invite' : null)
        }}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={openDialog === 'edit'}
            onOpenChange={(open) => {
              if (open) {
                setOpenDialog('edit')
              } else {
                setOpenDialog(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
          />


          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={openDialog === 'delete'}
            onOpenChange={(open) => {
              if (open) {
                setOpenDialog('delete')
              } else {
                setOpenDialog(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
