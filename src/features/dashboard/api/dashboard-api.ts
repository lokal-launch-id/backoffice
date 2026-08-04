import { apiClient, API_ENDPOINTS } from '@/lib/api'
import { PaginationMeta } from '@/features/product/api/products-api'

// The API has no stats endpoint, so every figure here is the `total_items` of a
// deliberately tiny page. Asking for limit=1 keeps each count to one row of
// payload instead of the server's default ten.
const COUNT_ONLY_LIMIT = 1

// The list endpoint answers 400 for anything outside this set, so `hidden` and
// `resubmitted` cannot be counted directly and are derived from the total.
export type CountableProductStatus = 'approved' | 'pending' | 'rejected'

interface CountOnlyResponse {
  meta: PaginationMeta
}

// Throws rather than falling back to zero when meta is missing. A count of 0
// tells a moderator there is nothing to do, which is the opposite of what a
// broken response means, so the two must not collapse into the same number.
async function countItems(endpoint: string): Promise<number> {
  const response = await apiClient.get<CountOnlyResponse>(endpoint)
  if (typeof response?.meta?.total_items !== 'number') {
    throw new Error(`No pagination meta in response from ${endpoint}`)
  }
  return response.meta.total_items
}

// Omitting the status counts every status, but only for a moderator or admin:
// the route is public and pins anonymous callers to `approved`.
export async function getProductCount(
  status?: CountableProductStatus
): Promise<number> {
  const params = new URLSearchParams({ limit: String(COUNT_ONLY_LIMIT) })
  if (status) {
    params.append('status', status)
  }
  return countItems(`${API_ENDPOINTS.products.list}?${params.toString()}`)
}

export interface UserCounts {
  total: number
  awaitingApproval: number
  // True when there are more users than one scan could cover, which makes
  // awaitingApproval a floor rather than an exact figure.
  isPartialScan: boolean
}

// No server-side filter exists for is_approved, so the waitlist has to be
// counted client-side. One page this size covers the curated alpha with room to
// spare; past that the UI says so rather than quietly under-reporting.
const USER_SCAN_LIMIT = 200

interface UserScanResponse {
  data: { is_approved?: boolean }[]
  meta: PaginationMeta
}

export async function getUserCounts(): Promise<UserCounts> {
  // Sends `limit`, not `page_size`: the users handler only reads `limit`.
  const response = await apiClient.get<UserScanResponse>(
    `${API_ENDPOINTS.users.list}?limit=${USER_SCAN_LIMIT}`
  )
  if (
    typeof response?.meta?.total_items !== 'number' ||
    !Array.isArray(response.data)
  ) {
    throw new Error('No user list in response from the users endpoint')
  }

  // Non-privileged callers get a trimmed row with no is_approved at all. That
  // would count as zero waitlisted users, which reads as "nobody is waiting"
  // when the truth is "this account cannot see". Fail instead.
  const hasApprovalField = response.data.some(
    (user) => typeof user.is_approved === 'boolean'
  )
  if (response.data.length > 0 && !hasApprovalField) {
    throw new Error('User list carries no approval status for this account')
  }

  return {
    total: response.meta.total_items,
    awaitingApproval: response.data.filter((user) => user.is_approved === false)
      .length,
    isPartialScan: response.meta.total_items > response.data.length,
  }
}
