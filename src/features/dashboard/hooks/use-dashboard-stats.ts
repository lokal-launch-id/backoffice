import { useQuery } from '@tanstack/react-query'
import {
  CountableProductStatus,
  getProductCount,
  getUserCounts,
} from '../api/dashboard-api'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  productCount: (status?: CountableProductStatus) =>
    [...dashboardKeys.all, 'product-count', status ?? 'all'] as const,
  userCounts: () => [...dashboardKeys.all, 'user-counts'] as const,
}

export const useProductCount = (status?: CountableProductStatus) => {
  return useQuery({
    queryKey: dashboardKeys.productCount(status),
    queryFn: () => getProductCount(status),
  })
}

export const useUserCounts = () => {
  return useQuery({
    queryKey: dashboardKeys.userCounts(),
    queryFn: getUserCounts,
  })
}
