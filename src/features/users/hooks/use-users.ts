import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  PaginationParams,
  resendVerificationEmail,
} from '../api/users-api'
import { User } from '../data/schema'

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string, pagination?: PaginationParams) =>
    [...userKeys.lists(), { filters, pagination }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export const useUsers = (filters?: string, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: userKeys.list(filters || '', pagination),
    queryFn: () => getUsers(pagination),
  })
}

// Hook for fetching a single user
const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id,
  })
}

// Hook for creating a user
const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Hook for updating a user
const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update the user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Hook for deleting a user
const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedId) => {
      // Remove the user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) })
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

const useResendVerificationEmail = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (email: string) => resendVerificationEmail(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}

export {
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResendVerificationEmail,
}
