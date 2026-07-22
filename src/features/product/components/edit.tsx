import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { useUpload } from '@/hooks/use-upload'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProductFormData } from '../data/schema'
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
  const { uploadImages } = useUpload()

  // Set the selected product ID when component mounts
  React.useEffect(() => {
    if (productId) {
      setSelectedProductId(productId)
    }
  }, [productId, setSelectedProductId])

  // Typed from the schema rather than hand-copied: the inline duplicate this
  // replaced had already drifted out of sync with it.
  const handleFormSubmit = async (data: ProductFormData) => {
    if (!selectedProduct) return
    try {
      // Newly picked files are held as blob: URLs and need uploading; images
      // already on the product are hosted and are kept as they are.
      const picked = data.images.filter((image) =>
        image.image_url.startsWith('blob:')
      )
      const existing = data.images
        .filter((image) => !image.image_url.startsWith('blob:'))
        .map((image) => image.image_url)
      const uploaded = picked.length
        ? (await uploadImages({ images: picked, type: 'product' })).map(
            (image) => image.url
          )
        : []
      const imageUrls = [...existing, ...uploaded]

      await updateProductMutation.mutateAsync({
        id: selectedProduct.id,
        data: {
          name_en: data.name_en,
          name_id: data.name_id,
          tagline: data.tagline,
          description_en: data.description_en,
          description_id: data.description_id,
          website_url: data.website_url,
          category_id: data.category_id,
          features: data.features,
          tech_stack: data.tech_stack,
          pricing: data.pricing,
          price_model: data.price_model || undefined,
          price_amount_idr: data.price_amount_idr ?? null,
          price_period: data.price_period || undefined,
          accepts_local_payment: data.accepts_local_payment ?? false,
          is_indonesian_spotlight: data.is_indonesian_spotlight ?? false,
          launch_date: data.launch_date
            ? format(data.launch_date, 'yyyy-MM-dd')
            : undefined,
          logo_url: imageUrls[0],
          image_urls: imageUrls.length ? imageUrls : undefined,
        },
      })
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
