import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Product } from '../data/schema'
import { ProductPrimaryButtons } from './product-primary-buttons'

interface ProductDetailHeaderProps {
  product: Product
}

export function ProductDetailHeader({ product }: ProductDetailHeaderProps) {
  const userName =
    product.user.first_name || product.user.last_name
      ? `${product.user.first_name ?? ''} ${product.user.last_name ?? ''}`.trim()
      : product.user.username

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Avatar>
            <AvatarImage src={product.user.avatar_url} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{product.name_en}</CardTitle>
            <div className='text-muted-foreground text-sm'>
              {product.tagline}
            </div>
            <div className='mt-2 text-sm'>
              <span className='font-semibold'>Maker: </span>
              {userName || 'Unknown'}
              {product.user.is_indonesian_maker && (
                <span className='ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800'>
                  Indonesian Maker
                </span>
              )}
            </div>
          </div>
        </div>
        <ProductPrimaryButtons type='edit' />
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='font-semibold'>Product ID</p>
            <p>{product.id}</p>
            <p className='mt-2 font-semibold'>Status</p>
            <p>{product.status}</p>
            <p className='mt-2 font-semibold'>Created At</p>
            <p>{product.created_at}</p>
            <p className='mt-2 font-semibold'>Updated At</p>
            <p>{product.updated_at}</p>
            <p className='mt-2 font-semibold'>Category</p>
            <p>
              {product.category.name_en} {product.category.icon_url}
            </p>
            <p className='mt-2 font-semibold'>Featured</p>
            <p>{product.is_featured ? 'Yes' : 'No'}</p>
            <p className='mt-2 font-semibold'>Tech Stack</p>
            {product.tech_stack && product.tech_stack.length > 0 ? (
              <ul className='list-inside list-disc'>
                {product.tech_stack.map((tech, idx) => (
                  <li key={idx}>{tech}</li>
                ))}
              </ul>
            ) : (
              <span className='text-muted-foreground'>
                No tech stack listed
              </span>
            )}
          </div>
          <div>
            <p className='font-semibold'>Product Name (EN)</p>
            <p>{product.name_en}</p>
            <p className='mt-2 font-semibold'>Product Name (ID)</p>
            <p>{product.name_id}</p>
            <p className='mt-2 font-semibold'>Website</p>
            <a
              href={product.website_url}
              className='text-blue-600 underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              {product.website_url}
            </a>
            <p className='mt-2 font-semibold'>Total Claps</p>
            <p>{product.total_claps}</p>
            <p className='mt-2 font-semibold'>Total Comments</p>
            <p>{product.total_comments}</p>
            <p className='mt-2 font-semibold'>Features</p>
            {product.features && product.features.length > 0 ? (
              <ul className='list-inside list-disc'>
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            ) : (
              <span className='text-muted-foreground'>No features listed</span>
            )}
          </div>
        </div>
        <div className='mt-6 grid grid-cols-2 gap-4'>
          <div>
            <p className='font-semibold'>Description (EN)</p>
            <p>{product.description_en}</p>
          </div>
          <div>
            <p className='font-semibold'>Description (ID)</p>
            <p>{product.description_id}</p>
          </div>
        </div>
        {/* Images List */}
        <div className='mt-6'>
          <p className='mb-2 font-semibold'>Images</p>
          <div className='flex flex-wrap gap-2'>
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Product image ${idx + 1}`}
                  className='h-32 w-32 rounded border object-cover'
                />
              ))
            ) : (
              <span className='text-muted-foreground'>No images available</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
