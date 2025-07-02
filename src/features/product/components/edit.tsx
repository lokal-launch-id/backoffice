import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProductImage } from '../data/schema'
import { useUpdateProduct } from '../hooks/use-products'
import { useProducts } from '../stores/productsStore'
import { ProductDialogs } from './product-dialogs'
import { ProductForm } from './product-form'
import { ProductSidebar } from './product-sidebar'

function ProductsEditContent() {
  const { productId } = useParams({
    from: '/_authenticated/products/edit/$productId',
  })
  const navigate = useNavigate()
  const { selectedProduct, isLoadingProduct, error, setSelectedProductId } =
    useProducts()
  const updateProductMutation = useUpdateProduct()

  // Set the selected product ID when component mounts
  React.useEffect(() => {
    if (productId) {
      setSelectedProductId(productId)
    }
  }, [productId, setSelectedProductId])

  const handleFormSubmit = async (data: {
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
    images: ProductImage[]
  }) => {
    if (!selectedProduct) return
    try {
      await updateProductMutation.mutateAsync({ id: selectedProduct.id, data })
      navigate({ to: '/products/detail/$productId', params: { productId } })
    } catch (_) {
      // Handle error if needed
    }
  }

  const handleCancel = () => {
    // Navigate back to detail page
    navigate({ to: '/products/detail/$productId', params: { productId } })
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
        <div className='-mx-4 flex overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-4'>
          <div className='w-full lg:w-2/3'>
            <ProductForm
              product={selectedProduct}
              isEditing={true}
              hideStatus={true}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </div>
          <div className='w-full lg:w-1/3'>
            <ProductSidebar />
          </div>
        </div>
      </Main>
      <ProductDialogs />
    </>
  )
}

export default function ProductsEdit() {
  return <ProductsEditContent />
}
