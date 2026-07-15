import {
  IconShield,
  IconUserShield,
  IconUsersGroup,
  IconRefresh,
} from '@tabler/icons-react'
import { ProductStatus } from './schema'

export const callTypes = new Map<ProductStatus, string>([
  [
    'approved',
    'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  ],
  [
    'resubmitted',
    'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200',
  ],
  ['pending', 'bg-neutral-300/40 border-neutral-300'],
  ['rejected', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
])

export const productStatus = [
  {
    label: 'Approved',
    value: 'approved',
    icon: IconShield,
  },
  {
    label: 'Pending',
    value: 'pending',
    icon: IconUserShield,
  },
  {
    label: 'Rejected',
    value: 'rejected',
    icon: IconUsersGroup,
  },
  {
    label: 'Resubmit',
    value: 'resubmit',
    icon: IconRefresh,
  },
] as const
