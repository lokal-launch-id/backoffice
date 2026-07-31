import {
  IconShield,
  IconUserShield,
  IconUsersGroup,
  IconRefresh,
  IconEyeOff,
} from '@tabler/icons-react'
import { ProductStatus } from './schema'

// The single source of truth for status filter options. Values must be exactly
// what the API emits (see models.ProductStatus): a label-only mismatch here
// silently filters nothing, which is how 'resubmit' hid every resubmission from
// the moderators who most needed to find them.
export const productStatuses: {
  label: string
  value: ProductStatus
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { label: 'Approved', value: 'approved', icon: IconShield },
  { label: 'Pending', value: 'pending', icon: IconUserShield },
  { label: 'Rejected', value: 'rejected', icon: IconUsersGroup },
  { label: 'Resubmitted', value: 'resubmitted', icon: IconRefresh },
  { label: 'Hidden', value: 'hidden', icon: IconEyeOff },
]

// The review queue only ever holds these two, and calls a first submission
// "New" - offering Approved or Rejected there filters to an empty table.
export const queueStatuses = [
  { ...productStatuses[1], label: 'New' },
  productStatuses[3],
]
