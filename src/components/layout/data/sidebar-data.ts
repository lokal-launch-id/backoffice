import {
  IconCalendarTime,
  IconChartBar,
  IconChecklist,
  IconConfetti,
  IconHelp,
  IconHistory,
  IconLayoutDashboard,
  IconPackages,
  IconPalette,
  IconSandbox,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'
import { Command, Upload } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'Lokal Lauch ID',
      logo: Command,
      plan: 'Group',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          // A collapsible group carries no url of its own (see NavCollapsible):
          // it expands to the children below rather than navigating.
          title: 'Products',
          icon: IconChecklist,
          items: [
            {
              title: 'List',
              url: '/products/list',
              icon: IconChecklist,
            },
            {
              title: 'Create',
              url: '/products/create',
              icon: IconChecklist,
            },
            {
              title: 'Queue',
              url: '/products/queue',
              icon: IconCalendarTime,
            },
            {
              title: 'Moderation Log',
              url: '/products/moderation-log',
              icon: IconHistory,
            },
          ],
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
        {
          title: 'Claps',
          icon: IconConfetti,
          items: [
            {
              title: 'Moderation',
              url: '/claps/moderation',
              icon: IconSandbox,
            },
            {
              title: 'Analytics',
              url: '/claps/analytics',
              icon: IconChartBar,
            },
          ],
        },
        {
          title: 'Categories',
          url: '/categories',
          icon: IconPackages,
        },
        {
          title: 'Utilities',
          icon: Upload,
          items: [
            {
              title: 'Upload',
              url: '/utilities/upload',
              icon: Upload,
            },
          ],
        },
      ],
    },

    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            // {
            //   title: 'Profile',
            //   url: '/settings',
            //   icon: IconUserCog,
            // },
            // {
            //   title: 'Account',
            //   url: '/settings/account',
            //   icon: IconTool,
            // },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            // {
            //   title: 'Notifications',
            //   url: '/settings/notifications',
            //   icon: IconNotification,
            // },
            // {
            //   title: 'Display',
            //   url: '/settings/display',
            //   icon: IconBrowserCheck,
            // },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
