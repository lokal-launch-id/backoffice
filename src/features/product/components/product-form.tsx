import { useEffect } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { IconEdit, IconX } from '@tabler/icons-react'
import { useAuthStore } from '@//stores/authStore'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Product,
  ProductFormData,
  ProductImage,
  ProductStatus,
  Category,
} from '../data/schema'
import { productFormSchema } from '../data/schema'
import { EditableList } from './product-editable-list'

// Form schema for product editing
interface ProductFormProps {
  product: Product
  isEditing?: boolean
  onSubmit?: (
    data: ProductFormData & { category_id?: string; category?: Category }
  ) => void
  onCancel?: () => void
  categories?: Category[]
  hideStatus?: boolean
  isFromCreate?: boolean
}

export function ProductForm({
  product,
  isEditing = false,
  onSubmit,
  onCancel,
  categories = [],
  hideStatus = false,
  isFromCreate = false,
}: ProductFormProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const getInitialValues = (): ProductFormData => ({
    name_en: product.name_en,
    name_id: product.name_id,
    tagline: product.tagline,
    description_en: product.description_en,
    description_id: product.description_id,
    website_url: product.website_url,
    status: product.status,
    is_featured: product.is_featured,
    features: product.features || [],
    tech_stack: product.tech_stack || [],
    pricing: typeof product.pricing === 'string' ? product.pricing : undefined,
    images:
      (product.images as unknown as Partial<ProductImage>[])?.map((image) => ({
        id: image.id || '',
        product_id: image.product_id || product.id,
        image_url: image.image_url || '',
        order_index: image.order_index || 0,
        created_at: image.created_at || new Date().toISOString(),
      })) || [],
    category_id: product.category_id,
    category: product.category?.id || '',
    launch_date:
      product.launch_date && !isNaN(new Date(product.launch_date).getTime())
        ? new Date(product.launch_date)
        : undefined,
  })

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getInitialValues(),
  })

  // Reset form when product changes OR when entering edit mode
  useEffect(() => {
    const initialValues = getInitialValues()
    form.reset(initialValues)
  }, [product, isEditing])

  const handleSubmit = (data: ProductFormData) => {
    if (onSubmit) {
      onSubmit({
        ...data,
        launch_date: data.launch_date
          ? format(data.launch_date, 'yyyy-MM-dd')
          : undefined,
      } as ProductFormData & { category_id?: string; category?: Category })
    }
  }

  const handleEdit = () => {
    navigate({
      to: '/products/edit/$productId',
      params: { productId: product.id },
    })
  }

  const handleCancel = () => {
    form.reset(getInitialValues())
    if (onCancel) {
      onCancel()
    }
  }

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues('images')
    const updatedImages = currentImages.filter((_, i) => i !== index)
    form.setValue('images', updatedImages)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const currentImages = form.getValues('images')
      const newImages = Array.from(files).map((file) => {
        // Create a temporary URL for preview
        return URL.createObjectURL(file)
      })
      form.setValue('images', [
        ...currentImages,
        ...newImages.map((image) => ({
          id: '',
          product_id: product.id,
          image_url: image,
          order_index: currentImages.length + 1,
          created_at: new Date().toISOString(),
        })),
      ])
    }
  }

  const getAdminUser = () => {
    return user?.first_name || user?.last_name
      ? `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()
      : ''
  }

  const userName = isFromCreate
    ? getAdminUser()
    : product.user.first_name || product.user.last_name
      ? `${product.user.first_name ?? ''} ${product.user.last_name ?? ''}`.trim()
      : product.user.username

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Avatar>
            <AvatarImage src={product.user.avatar_url ?? ''} />
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
        {!isEditing && (
          <Button className='space-x-1' onClick={handleEdit}>
            <span>Edit Product</span> <IconEdit size={18} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            {/* Basic Information */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <FormField
                control={form.control}
                name='name_en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name (EN)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder='Enter product name in English'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name (ID)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder='Enter product name in Indonesian'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='tagline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder='Enter product tagline'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <FormField
                control={form.control}
                name='description_en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (EN)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={!isEditing}
                        placeholder='Enter product description in English'
                        className='min-h-[100px]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (ID)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={!isEditing}
                        placeholder='Enter product description in Indonesian'
                        className='min-h-[100px]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='website_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder='https://example.com'
                      type='url'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Launch Date */}
            <FormField
              control={form.control}
              name='launch_date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Launch Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={!isEditing}
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date < new Date() ||
                          date >
                            new Date(
                              new Date().setFullYear(
                                new Date().getFullYear() + 4
                              )
                            )
                        }
                        captionLayout='dropdown'
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Select */}
            {isEditing && categories.length > 0 && (
              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value || ''}
                      onValueChange={(value) => {
                        field.onChange(value)
                        const cat = categories.find((c) => c.id === value)
                        form.setValue('category', cat?.id || '')
                      }}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name_en} {cat.icon_url}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Hide status if hideStatus is true */}
            {!hideStatus && (
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Status</FormLabel>
                    <div className='text-sm text-red-300'>
                      Status change can be done from Decision Management (Right
                      side) or Database (TBU)
                    </div>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value as ProductStatus)
                      }}
                      value={field.value ?? ''}
                      disabled={true}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='approved'>Approved</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='rejected'>Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='is_featured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Featured Product</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='pricing'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder='Enter pricing information'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Read-only Information */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div>
                <div className='mb-2 leading-none'>
                  <FormLabel>Product ID</FormLabel>
                </div>
                <Input value={product.id ?? ''} disabled className='bg-muted' />
              </div>

              {!isFromCreate && (
                <div>
                  <div className='mb-2 leading-none'>
                    <FormLabel>Category</FormLabel>
                  </div>
                  <Input
                    value={`${product.category.name_en ?? ''}  ${product.category.icon_url ?? ''}`}
                    disabled
                    className='bg-muted'
                  />
                </div>
              )}
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div>
                <div className='mb-2 leading-none'>
                  <FormLabel>Total Claps</FormLabel>
                </div>
                <Input
                  value={
                    product.total_claps != null
                      ? product.total_claps.toString()
                      : ''
                  }
                  disabled
                  className='bg-muted'
                />
              </div>
              <div>
                <div className='mb-2 leading-none'>
                  <FormLabel>Total Comments</FormLabel>
                </div>
                <Input
                  value={
                    product.total_comments != null
                      ? product.total_comments.toString()
                      : ''
                  }
                  disabled
                  className='bg-muted'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div>
                <div className='mb-2 leading-none'>
                  <FormLabel>Created At</FormLabel>
                </div>
                <Input
                  value={product.created_at ?? ''}
                  disabled
                  className='bg-muted'
                />
              </div>
              <div>
                <div className='mb-2 leading-none'>
                  <FormLabel>Updated At</FormLabel>
                </div>
                <Input
                  value={product.updated_at ?? ''}
                  disabled
                  className='bg-muted'
                />
              </div>
            </div>

            {/* Features Editable List */}
            <FormField
              control={form.control}
              name='features'
              render={({ field }) => (
                <FormItem>
                  <EditableList
                    label='Features'
                    items={field.value || []}
                    onChange={field.onChange}
                    isEditing={isEditing}
                    inputPlaceholder='Add feature'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tech Stack Editable List */}
            <FormField
              control={form.control}
              name='tech_stack'
              render={({ field }) => (
                <FormItem>
                  <EditableList
                    label='Tech Stack'
                    items={field.value || []}
                    onChange={field.onChange}
                    isEditing={isEditing}
                    inputPlaceholder='Add tech'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <div>
              <div className='mb-2 leading-none'>
                <FormLabel>Images</FormLabel>
              </div>
              {/* Display Images */}
              <div className='flex flex-wrap gap-2'>
                {form.watch('images') && form.watch('images').length > 0 ? (
                  form.watch('images').map((img: ProductImage, idx: number) => (
                    <div key={idx} className='group relative'>
                      <img
                        src={img.image_url}
                        alt={`Product image ${idx + 1}`}
                        className='h-32 w-32 rounded border object-cover'
                      />
                      {isEditing && (
                        <Button
                          type='button'
                          variant='destructive'
                          size='icon'
                          className='absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'
                          onClick={() => handleRemoveImage(idx)}
                        >
                          <IconX size={14} />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <span className='text-muted-foreground text-sm'>
                    No images available
                  </span>
                )}
              </div>

              {/* Image Upload (only in edit mode) */}
              {isEditing && (
                <div className='my-4'>
                  <div className='grid w-full max-w-sm items-center gap-3'>
                    <Label htmlFor='images'>Upload Images</Label>
                    <Input
                      id='images'
                      type='file'
                      multiple
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='cursor-pointer'
                    />
                    <p className='text-muted-foreground text-sm'>
                      <br />
                      Rules:
                      <br />
                      1) First image will be used as the product logo.
                      <br />
                      2) Upload three more images at most.
                      <br />
                      3) Delete existing images with the red button if you want
                      to replace them.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className='flex justify-end space-x-2'>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type='submit'>Save Changes</Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
