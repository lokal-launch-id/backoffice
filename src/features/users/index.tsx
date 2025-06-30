import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PaginationParams } from './api/users-api'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import { useUsers } from './hooks/use-users'

export default function Users() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  })

  const { data, isLoading, error } = useUsers(undefined, pagination)

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ page: 1, pageSize }) // Reset to first page when changing page size
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='w-full py-8 text-center'>Loading users...</div>
          ) : error ? (
            <div className='w-full py-8 text-center text-red-500'>
              Failed to load users.
            </div>
          ) : data ? (
            <UsersTable
              key={`${pagination.page}-${pagination.pageSize}`}
              columns={columns}
              data={data.data}
              meta={data.meta}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          ) : (
            <div className='w-full py-8 text-center'>No data available.</div>
          )}
        </div>
      </Main>

      <UsersDialogs />
    </>
  )
}
