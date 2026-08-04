import { ReactNode } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  title: string
  value: number | undefined
  // isPending, not isLoading. In TanStack Query v5 `isLoading` is
  // `isPending && isFetching`, so between retry attempts — pending, but with
  // nothing in flight — it goes false while `isError` is still false too. The
  // card would then fall through to the value branch and render a confident 0
  // for the length of the backoff. `isPending` stays true across the whole
  // retry sequence, so the skeleton holds until the query really settles.
  isPending: boolean
  isError: boolean
  icon?: ReactNode
  // Shown under the number when there is one. The zero case gets its own line
  // so an empty queue reads as finished work rather than as missing data.
  hint?: string
  emptyHint?: string
  // Any route the count can be acted on from. Cards without one are context.
  to?: LinkProps['to']
  emphasis?: boolean
}

export function StatCard({
  title,
  value,
  isPending,
  isError,
  icon,
  hint,
  emptyHint,
  to,
  emphasis = false,
}: StatCardProps) {
  const body = (
    <Card
      className={cn(
        // h-full matters: a card with `to` is wrapped in a Link, so the Link
        // becomes the grid item and stretches while the Card inside sizes to
        // its content. Without this the linked cards come out shorter than
        // their neighbours and the row looks ragged.
        'h-full gap-2 py-4',
        emphasis && 'border-primary/40',
        to && 'hover:border-primary transition-colors'
      )}
    >
      <CardHeader className='px-4'>
        <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='px-4'>
        {isPending ? (
          <>
            <Skeleton className='h-8 w-16' />
            <Skeleton className='mt-2 h-3 w-28' />
          </>
        ) : isError ? (
          // Never render a failed query as 0. "Nothing to do" and "we could not
          // find out" are different answers and a moderator acts on them
          // differently.
          <div className='text-muted-foreground flex items-start gap-2'>
            <AlertTriangle className='mt-0.5 size-4 shrink-0 text-amber-500' />
            <div>
              <div className='text-foreground text-lg leading-tight font-semibold'>
                Unavailable
              </div>
              <p className='text-xs'>Could not load this count. Try again.</p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={cn(
                'font-bold tabular-nums',
                emphasis ? 'text-4xl' : 'text-3xl'
              )}
            >
              {value ?? 0}
            </div>
            {(value === 0 ? (emptyHint ?? hint) : hint) && (
              <p className='text-muted-foreground mt-1 text-xs'>
                {value === 0 ? (emptyHint ?? hint) : hint}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )

  // A card with nowhere to go stays a plain card: wrapping it in a link that
  // leads back to the dashboard is a dead end dressed up as an action.
  if (!to) {
    return body
  }

  return (
    <Link to={to} className='block h-full'>
      {body}
    </Link>
  )
}
