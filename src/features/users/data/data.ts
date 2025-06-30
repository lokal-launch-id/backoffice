import { IconShield, IconUser, IconUserShield } from '@tabler/icons-react'

export const userTypes = [
  {
    label: 'Moderator',
    value: 'moderator',
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: IconUserShield,
  },
  {
    label: 'User',
    value: 'user',
    icon: IconUser,
  },
] as const
