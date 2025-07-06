import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ClapDialogs } from '../components/clap-dialogs'
import { clapsColumns } from '../components/claps-columns'
import { ClapsTable } from '../components/claps-table'
import { PaginationParams } from '../data/schema'
import { useClaps } from '../hooks/use-claps'

export default function ClapModeration() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 20,
    sort: 'newest',
  })

  const { data, isLoading, error } = useClaps(pagination)

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, page: 1, limit: pageSize }))
  }

  const handleSortChange = (sort: 'newest' | 'oldest' | 'most_clapped') => {
    setPagination((prev) => ({ ...prev, sort, page: 1 }))
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
            <h2 className='text-2xl font-bold tracking-tight'>
              Clap Moderation
            </h2>
            <p className='text-muted-foreground'>
              Manage and moderate product claps
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='w-full py-8 text-center'>Loading claps...</div>
          ) : error ? (
            <div className='w-full py-8 text-center text-red-500'>
              Failed to load claps.
            </div>
          ) : data ? (
            <ClapsTable
              key={`${pagination.page}-${pagination.limit}-${pagination.sort}`}
              columns={clapsColumns}
              data={data.data}
              meta={data.meta}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSortChange={handleSortChange}
              currentSort={pagination.sort}
            />
          ) : (
            <div className='w-full py-8 text-center'>No data available.</div>
          )}
        </div>
      </Main>
      <ClapDialogs />
    </>
  )
}
