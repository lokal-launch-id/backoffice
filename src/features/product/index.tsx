import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PaginationParams } from './api/products-api'
import { ProductDialogs } from './components/product-dialogs'
import { productsColumns } from './components/products-columns'
import { ProductsTable } from './components/products-table'
import { useProducts as useProductsQuery } from './hooks/use-products'

export default function Products() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 30,
    limit: 30,
  })

  const { data, isLoading, error } = useProductsQuery(undefined, pagination)

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ page: 1, pageSize, limit: pagination.limit }) // Reset to first page when changing page size
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
            <h2 className='text-2xl font-bold tracking-tight'>Product List</h2>
            <p className='text-muted-foreground'>Manage your products here.</p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='w-full py-8 text-center'>Loading products...</div>
          ) : error ? (
            <div className='w-full py-8 text-center text-red-500'>
              Failed to load products.
            </div>
          ) : data ? (
            <ProductsTable
              key={`${pagination.page}-${pagination.pageSize}`}
              columns={productsColumns}
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
      <ProductDialogs />
    </>
  )
}
