import { useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CategoryFormData } from '../data/schema'
import { useCreateCategory } from '../hooks/use-categories'
import { CategoriesDialogs } from './categories-dialogs'
import { CategoryForm } from './category-form'

function CategoriesCreateContent() {
  const navigate = useNavigate()
  const createCategoryMutation = useCreateCategory()

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      await createCategoryMutation.mutateAsync(data)
      navigate({ to: '/categories' })
    } catch (error) {
      // TODO: show error toast
      console.error('Failed to create category:', error)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/categories' })
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
              Create Category
            </h2>
            <p className='text-muted-foreground'>
              Add a new category to organize products.
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <CategoryForm
            isEditing={false}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isLoading={createCategoryMutation.isPending}
          />
        </div>
      </Main>
      <CategoriesDialogs />
    </>
  )
}

export default function CategoriesCreate() {
  return <CategoriesCreateContent />
}
