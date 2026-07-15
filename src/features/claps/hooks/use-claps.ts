import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getClaps,
  setClapToZero,
  reduceClap,
  incrementClap,
} from '../api/claps-api'
import { PaginationParams } from '../data/schema'

// Query keys
export const clapKeys = {
  all: ['claps'] as const,
  lists: () => [...clapKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...clapKeys.lists(), params] as const,
}

// Fetch claps with pagination
export const useClaps = (params?: PaginationParams) => {
  return useQuery({
    queryKey: clapKeys.list(params),
    queryFn: () => getClaps(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Set clap to zero mutation
export const useSetClapToZero = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (clapId: string) => setClapToZero(clapId),
    onSuccess: () => {
      // Invalidate and refetch claps list
      queryClient.invalidateQueries({ queryKey: clapKeys.lists() })
      toast.success('Clap count set to zero successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to set clap to zero')
    },
  })
}

// Reduce clap mutation
export const useReduceClap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clapId, reduceBy }: { clapId: string; reduceBy: number }) =>
      reduceClap(clapId, reduceBy),
    onSuccess: () => {
      // Invalidate and refetch claps list
      queryClient.invalidateQueries({ queryKey: clapKeys.lists() })
      toast.success('Clap count reduced successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reduce clap count')
    },
  })
}

// Increment clap mutation
export const useIncrementClap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      clapId,
      incrementBy,
    }: {
      clapId: string
      incrementBy: number
    }) => incrementClap(clapId, incrementBy),
    onSuccess: () => {
      // Invalidate and refetch claps list
      queryClient.invalidateQueries({ queryKey: clapKeys.lists() })
      toast.success('Clap count incremented successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to increment clap count')
    },
  })
}
