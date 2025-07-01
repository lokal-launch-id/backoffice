import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CategoryFormData, categoryFormSchema } from '../data/schema'

interface CategoryFormProps {
  category?: {
    id: string
    name_en: string
    name_id: string
    icon_url: string
  }
  isEditing?: boolean
  onSubmit: (data: CategoryFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CategoryForm({
  category,
  isEditing = false,
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name_en: category?.name_en || '',
      name_id: category?.name_id || '',
      icon_url: category?.icon_url || '',
    },
  })

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data)
  }

  return (
    <div className='mx-auto max-w-2xl space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Edit Category' : 'Create New Category'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='name_en'>Name (English)</Label>
                  <Controller
                    name='name_en'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Input
                          id='name_en'
                          placeholder='Enter English name'
                          {...field}
                        />
                        {fieldState.error && (
                          <p className='text-sm text-red-500'>
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='name_id'>Name (Indonesian)</Label>
                  <Controller
                    name='name_id'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Input
                          id='name_id'
                          placeholder='Enter Indonesian name'
                          {...field}
                        />
                        {fieldState.error && (
                          <p className='text-sm text-red-500'>
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='icon_url'>Icon (Emoji)</Label>
                <Controller
                  name='icon_url'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        id='icon_url'
                        placeholder='Enter emoji icon (e.g., 🏢, 📚, 🪄)'
                        {...field}
                      />
                      {fieldState.error && (
                        <p className='text-sm text-red-500'>
                          {fieldState.error.message}
                        </p>
                      )}
                      {field.value && (
                        <div className='mt-2 flex items-center space-x-2'>
                          <span className='text-2xl'>{field.value}</span>
                          <span className='text-muted-foreground text-sm'>
                            Preview
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Category'
                    : 'Create Category'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
