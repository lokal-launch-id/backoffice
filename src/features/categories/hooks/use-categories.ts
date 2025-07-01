import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories-api'
import { Category } from '../data/schema'

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

// Hook for fetching all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => getCategories(),
  })
}

// Hook for fetching a single category
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategory(id),
    enabled: !!id,
  })
}

// Hook for creating a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Hook for updating a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      // Update the category in cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      )
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Hook for deleting a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_, deletedId) => {
      // Remove the category from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) })
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}
