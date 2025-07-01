import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { useUpload } from '@/hooks/use-upload'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getCategories } from '../api/products-api'
import { ProductsRequest } from '../api/products-api'
import {
  Product,
  ProductFormData,
  ProductStatus,
  Category,
} from '../data/schema'
import { useCreateProduct } from '../hooks/use-products'
import { ProductDialogs } from './product-dialogs'
import { ProductForm } from './product-form'

// Minimal empty user and category for new product
const emptyUser = {
  id: '',
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  bio: null,
  avatar_url: null,
  is_indonesian_maker: false,
  is_verified: false,
  role: 'user' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const emptyCategory = {
  id: '',
  name_en: '',
  name_id: '',
  icon_url: '',
  created_at: new Date().toISOString(),
}

const emptyProduct: Product = {
  id: '',
  user_id: '',
  category_id: '',
  name_en: '',
  name_id: '',
  tagline: '',
  description_en: '',
  description_id: '',
  website_url: '',
  status: 'pending' as ProductStatus,
  total_claps: 0,
  total_comments: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category: emptyCategory,
  user: emptyUser,
  is_featured: false,
  features: [],
  tech_stack: [],
  pricing: '',
  user_clapped: false,
  user_claps: 0,
  logo_url: '',
  launch_date: new Date(),
  images: [],
}

function ProductsCreateContent() {
  const navigate = useNavigate()
  const createProductMutation = useCreateProduct()
  const [categories, setCategories] = useState<Category[]>([])
  const { uploadImages } = useUpload()

  useEffect(() => {
    async function fetchCategories() {
      const cats = await getCategories()
      setCategories(cats)
    }
    fetchCategories()
  }, [])

  const handleFormSubmit = async (
    data: ProductFormData & { category_id?: string; category?: Category }
  ) => {
    // TODO: upload images to s3
    const uploadedImagesUrls = await uploadImages({
      images: data.images,
      type: 'product',
    })

    try {
      // Format data according to backend validation structure
      const payload: ProductsRequest = {
        name_en: data.name_en,
        name_id: data.name_id,
        tagline: data.tagline,
        description_en: data.description_en,
        description_id: data.description_id,
        website_url: data.website_url,
        logo_url: uploadedImagesUrls[0]?.url || '',
        category_id: data.category_id || '',
        features: data.features,
        tech_stack: data.tech_stack,
        pricing: data.pricing,
        launch_date: data.launch_date
          ? format(new Date(data.launch_date), 'yyyy-MM-dd')
          : undefined,
        image_urls: uploadedImagesUrls.map((image) => image.url),
      }

      await createProductMutation.mutateAsync(payload)
      navigate({ to: '/products/list' })
    } catch (_e) {
      // TODO: show error toast
    }
  }

  const handleCancel = () => {
    navigate({ to: '/products' })
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
              Create Product
            </h2>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <ProductForm
            product={emptyProduct}
            isEditing={true}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            categories={categories}
            hideStatus={true}
            isFromCreate={true}
          />
        </div>
      </Main>
      <ProductDialogs />
    </>
  )
}

export default function ProductsCreate() {
  return <ProductsCreateContent />
}
