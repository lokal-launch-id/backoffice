import React from 'react'
import { useParams } from '@tanstack/react-router'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { ProductFormData } from '../data/schema'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useModerationHistory } from '../hooks/use-products'
import { useProducts } from '../stores/productsStore'
import { ModerationHistoryTable } from './moderation-history-table'
import { ProductDialogs } from './product-dialogs'
import { ProductForm } from './product-form'

function ProductsDetailContent() {
  const { productId } = useParams({
    from: '/_authenticated/products/detail/$productId',
  })
  const { selectedProduct, isLoadingProduct, error, setSelectedProductId } =
    useProducts()

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useModerationHistory(productId)

  // Set the selected product ID when component mounts
  React.useEffect(() => {
    if (productId) {
      setSelectedProductId(productId)
    }
  }, [productId, setSelectedProductId])

  // Typed from the schema rather than hand-copied: the inline duplicate this
  // replaced had already drifted out of sync with it.
  const handleFormSubmit = (data: ProductFormData) => {
    showSubmittedData(data, 'Product updated successfully:')
  }

  if (isLoadingProduct) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-lg'>Loading product...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-lg text-red-600'>
          Error loading product: {error.message}
        </div>
      </div>
    )
  }

  if (!selectedProduct) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-muted-foreground text-lg'>Product not found</div>
      </div>
    )
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
              Product Detail
            </h2>
          </div>
        </div>
        <div className='-mx-4 flex overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-6'>
          <div className='w-full lg:w-3/3'>
            <ProductForm
              product={selectedProduct}
              isEditing={false}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>Moderation History</CardTitle>
          </CardHeader>
          <CardContent>
            <ModerationHistoryTable
              items={historyData?.data ?? []}
              isLoading={historyLoading}
              error={historyError as Error | null}
            />
          </CardContent>
        </Card>
      </Main>
      <ProductDialogs />
    </>
  )
}

export default function ProductsDetail() {
  return <ProductsDetailContent />
}
