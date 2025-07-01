import React from 'react'
import { useParams } from '@tanstack/react-router'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useProducts } from '../stores/productsStore'
import { ProductDialogs } from './product-dialogs'
import { ProductForm } from './product-form'

function ProductsDetailContent() {
  const { productId } = useParams({
    from: '/_authenticated/products/detail/$productId',
  })
  const { selectedProduct, isLoadingProduct, error, setSelectedProductId } =
    useProducts()

  // Set the selected product ID when component mounts
  React.useEffect(() => {
    if (productId) {
      setSelectedProductId(productId)
    }
  }, [productId, setSelectedProductId])

  const handleFormSubmit = (data: {
    name_en: string
    name_id: string
    tagline: string
    description_en: string
    description_id: string
    website_url: string
    status: 'approved' | 'pending' | 'rejected'
    is_featured: boolean
    features: string[]
    tech_stack: string[]
    pricing?: string
    images: {
      id: string
      product_id: string
      image_url: string
      order_index: number
      created_at: string
    }[]
  }) => {
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
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <ProductForm
            product={selectedProduct}
            isEditing={false}
            onSubmit={handleFormSubmit}
          />
        </div>
      </Main>
      <ProductDialogs />
    </>
  )
}

export default function ProductsDetail() {
  return <ProductsDetailContent />
}
