import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CategoryFormData } from '../data/schema'
import { useCategories, useUpdateCategory, useDeleteCategory } from '../hooks/use-categories'
import { useCategoriesStore } from '../stores/categoriesStore'
import { CategoryForm } from './category-form'

export function CategoriesDialogs() {
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  } = useCategoriesStore()

  const { data: categories } = useCategories()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const selected = categories?.find((c) => c.id === selectedCategoryId)

  const closeEdit = () => {
    setIsEditDialogOpen(false)
    setSelectedCategoryId(null)
  }

  const closeDelete = () => {
    setIsDeleteDialogOpen(false)
    setSelectedCategoryId(null)
  }

  const handleUpdate = async (data: CategoryFormData) => {
    if (!selectedCategoryId) return
    try {
      await updateCategory.mutateAsync({ id: selectedCategoryId, data })
      toast.success('Category updated')
      closeEdit()
    } catch {
      toast.error('Failed to update category')
    }
  }

  const handleDelete = async () => {
    if (!selectedCategoryId) return
    try {
      await deleteCategory.mutateAsync(selectedCategoryId)
      toast.success('Category deleted')
      closeDelete()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  return (
    <>
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => (open ? null : closeEdit())}
      >
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selected && (
            <CategoryForm
              category={{
                id: selected.id,
                name_en: selected.name_en,
                name_id: selected.name_id,
                icon_url: selected.icon_url,
              }}
              isEditing
              onSubmit={handleUpdate}
              onCancel={closeEdit}
              isLoading={updateCategory.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => (open ? null : closeDelete())}
        title='Delete category'
        desc={
          selected
            ? `Are you sure you want to delete "${selected.name_en}"? This cannot be undone.`
            : 'Are you sure you want to delete this category? This cannot be undone.'
        }
        destructive
        confirmText='Delete'
        isLoading={deleteCategory.isPending}
        handleConfirm={handleDelete}
      />
    </>
  )
}
