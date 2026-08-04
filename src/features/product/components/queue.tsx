import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PaginationParams, QueueStatus } from '../api/products-api'
import { ProductQueueItem, PaginationMeta } from '../api/products-api'
import { queueStatuses } from '../data/data'
import { useProductQueue } from '../hooks/use-products'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { queueColumns } from './queue-columns'

export default function ProductQueue() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    limit: 10,
  })
  // The status filter lives here, not inside the table: the table only holds
  // one page, so filtering there would only ever find the resubmissions that
  // happened to be on the page in front of you. The API does the filtering.
  const [statuses, setStatuses] = useState<QueueStatus[]>([])

  const { data, isLoading, error } = useProductQueue(pagination, statuses)

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ page: 1, pageSize, limit: pagination.limit })
  }

  // A narrower queue has fewer pages, so page 3 of the old filter is usually
  // past the end of the new one.
  const handleStatusesChange = (next: QueueStatus[]) => {
    setStatuses(next)
    setPagination((prev) => ({ ...prev, page: 1 }))
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
              Product Review Queue
            </h2>
            <p className='text-muted-foreground'>
              Review and manage product submissions
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='w-full py-8 text-center'>Loading queue...</div>
          ) : error ? (
            <div className='w-full py-8 text-center text-red-500'>
              Failed to load queue.
            </div>
          ) : data ? (
            <QueueTableInner
              key={`${pagination.page}-${pagination.pageSize}`}
              columns={queueColumns}
              data={data.data}
              meta={data.meta}
              statuses={statuses}
              onStatusesChange={handleStatusesChange}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          ) : (
            <div className='w-full py-8 text-center'>No data available.</div>
          )}
        </div>
      </Main>
    </>
  )
}

interface QueueTableInnerProps {
  columns: ColumnDef<ProductQueueItem>[]
  data: ProductQueueItem[]
  meta: PaginationMeta
  statuses: QueueStatus[]
  onStatusesChange: (statuses: QueueStatus[]) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function QueueTableInner({
  columns,
  data,
  meta,
  statuses,
  onStatusesChange,
  onPageChange,
  onPageSizeChange,
}: QueueTableInnerProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  // Every filter except status, which the API owns.
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  // The toolbar reads and writes the status filter through the table, so the
  // parent's selection is mirrored in as table state and any change to it is
  // handed back out rather than being applied to the rows on this page.
  const effectiveFilters: ColumnFiltersState = statuses.length
    ? [...columnFilters, { id: 'status', value: statuses }]
    : columnFilters

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    updater
  ) => {
    const next =
      typeof updater === 'function' ? updater(effectiveFilters) : updater
    const nextStatuses =
      (next.find((f) => f.id === 'status')?.value as QueueStatus[]) ?? []
    if (
      nextStatuses.length !== statuses.length ||
      nextStatuses.some((s) => !statuses.includes(s))
    ) {
      onStatusesChange(nextStatuses)
    }
    setColumnFilters(next.filter((f) => f.id !== 'status'))
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters: effectiveFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='w-full space-y-4'>
      <DataTableToolbar table={table} statusOptions={queueStatuses} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={header.column.columnDef.meta?.className ?? ''}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        meta={meta}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        selectedRows={table.getFilteredSelectedRowModel().rows.length}
      />
    </div>
  )
}
