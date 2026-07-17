import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { useAllModerationHistory } from '../hooks/use-products'
import { ModerationHistoryTable } from './moderation-history-table'

export default function ModerationLog() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useAllModerationHistory({
    page,
    limit: 20,
  })

  const meta = data?.meta
  const totalPages = meta?.total_pages ?? 1

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
              Moderation Log
            </h2>
            <p className='text-muted-foreground'>
              Every approval and rejection decision across all products.
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 space-y-4 overflow-auto px-4 py-1'>
          <ModerationHistoryTable
            items={data?.data ?? []}
            isLoading={isLoading}
            error={error as Error | null}
            showProduct
          />
          {meta && meta.total_pages > 1 && (
            <div className='flex items-center justify-end gap-2'>
              <span className='text-muted-foreground text-sm'>
                Page {page} of {totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
