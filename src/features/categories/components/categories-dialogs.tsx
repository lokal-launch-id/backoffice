import { useCategoriesStore } from '../stores/categoriesStore'

export function CategoriesDialogs() {
  const {
    isCreateDialogOpen: _isCreateDialogOpen,
    setIsCreateDialogOpen: _setIsCreateDialogOpen,
    isEditDialogOpen: _isEditDialogOpen,
    setIsEditDialogOpen: _setIsEditDialogOpen,
    isDeleteDialogOpen: _isDeleteDialogOpen,
    setIsDeleteDialogOpen: _setIsDeleteDialogOpen,
  } = useCategoriesStore()

  return (
    <>
      {/* TODO: Add create, edit, and delete dialogs here */}
      {/* For now, this is a placeholder component */}
    </>
  )
}
