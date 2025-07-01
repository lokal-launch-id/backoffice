import { create } from 'zustand'

interface CategoriesState {
  selectedCategoryId: string | null
  setSelectedCategoryId: (id: string | null) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  selectedCategoryId: null,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  isCreateDialogOpen: false,
  setIsCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
  isEditDialogOpen: false,
  setIsEditDialogOpen: (open) => set({ isEditDialogOpen: open }),
  isDeleteDialogOpen: false,
  setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
}))
