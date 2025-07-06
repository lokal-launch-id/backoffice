import { apiClient } from '@/lib/api'
import {
  Clap,
  ClapsResponse,
  PaginationParams,
  SetClapToZero,
  ReduceClap,
  IncrementClap,
} from '../data/schema'

export interface ClapActionResponse {
  success: boolean
  message?: string
  data?: Clap
}

export class ClapsApi {
  static async getClaps(params?: PaginationParams): Promise<ClapsResponse> {
    const searchParams = new URLSearchParams()

    if (params?.page) {
      searchParams.append('page', (params.page - 1).toString()) // Convert to 0-based
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString())
    }
    if (params?.sort) {
      searchParams.append('sort', params.sort)
    }

    const endpoint = `/claps${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return apiClient.get<ClapsResponse>(endpoint)
  }

  static async setClapToZero(clapId: string): Promise<ClapActionResponse> {
    const endpoint = `/admin/claps/${clapId}`
    const body: SetClapToZero = { set_to_zero: true }
    return apiClient.patch<ClapActionResponse>(endpoint, body)
  }

  static async reduceClap(
    clapId: string,
    reduceBy: number
  ): Promise<ClapActionResponse> {
    const endpoint = `/admin/claps/${clapId}`
    const body: ReduceClap = { reduce_by: reduceBy }
    return apiClient.patch<ClapActionResponse>(endpoint, body)
  }

  static async incrementClap(
    clapId: string,
    incrementBy: number
  ): Promise<ClapActionResponse> {
    const endpoint = `/admin/claps/${clapId}`
    const body: IncrementClap = { increment_by: incrementBy }
    return apiClient.patch<ClapActionResponse>(endpoint, body)
  }
}

// Export functions for use in hooks
export const getClaps = ClapsApi.getClaps
export const setClapToZero = ClapsApi.setClapToZero
export const reduceClap = ClapsApi.reduceClap
export const incrementClap = ClapsApi.incrementClap
