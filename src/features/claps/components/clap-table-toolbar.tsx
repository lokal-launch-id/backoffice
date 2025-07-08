import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ClapTableToolbarProps<TData> {
  table: Table<TData>
  onSortChange: (sort: 'newest' | 'oldest' | 'most_clapped') => void
  currentSort: 'newest' | 'oldest' | 'most_clapped'
}

export function ClapTableToolbar<TData>({
  table,
  onSortChange,
  currentSort,
}: ClapTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter by product name...'
          value={
            (table.getColumn('product.name_en')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) =>
            table
              .getColumn('product.name_en')
              ?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          <Select value={currentSort} onValueChange={onSortChange}>
            <SelectTrigger className='h-8 w-[140px]'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Newest</SelectItem>
              <SelectItem value='oldest'>Oldest</SelectItem>
              <SelectItem value='most_clapped'>Most Clapped</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
