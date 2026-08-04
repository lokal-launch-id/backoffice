import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  PaginationParams,
  ProductsRequest,
  QueueStatus,
  updateProductStatus,
  getPendingQueue,
  getModerationHistory,
  getAllModerationHistory,
} from '../api/products-api'

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string, pagination?: PaginationParams) =>
    [...productKeys.lists(), { filters, pagination }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
}

export const useProducts = (
  filters?: string,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: productKeys.list(filters || '', pagination),
    queryFn: () => getProducts(pagination),
  })
}

// Hook for fetching a single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
}

// Hook for creating a product
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Hook for updating a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<ProductsRequest> & { status?: string }
    }) => updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // Update the product in cache
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct
      )
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Hook for deleting a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, deletedId) => {
      // Remove the product from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) })
    },
    // Refetch on failure too, not just on success. The failure worth handling
    // is a row the list still shows after the product is already gone: the
    // delete comes back 404, and without this the stale row stays on screen
    // inviting the same click again. Refetching resolves it either way, and on
    // a 403 it costs one harmless request.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export const useProductDecision = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: { status: string; reason?: string }
    }) => updateProductStatus(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
      // Without this the product lingers in the review queue after a decision.
      queryClient.invalidateQueries({ queryKey: ['product-queue'] })
    },
  })
}

export const useProductQueue = (
  pagination?: PaginationParams,
  statuses?: QueueStatus[]
) => {
  return useQuery({
    // The status filter is part of the request, so it has to be part of the
    // cache key - otherwise a filtered page is served from the unfiltered one.
    queryKey: ['product-queue', pagination, statuses],
    queryFn: () => getPendingQueue(pagination, statuses),
  })
}

export const useModerationHistory = (productId: string) => {
  return useQuery({
    queryKey: [...productKeys.detail(productId), 'moderation-history'],
    queryFn: () => getModerationHistory(productId),
    enabled: !!productId,
  })
}

export const useAllModerationHistory = (pagination?: PaginationParams) => {
  return useQuery({
    queryKey: ['moderation-history', 'all', pagination],
    queryFn: () => getAllModerationHistory(pagination),
  })
}
