import { Link } from '@tanstack/react-router'
import {
  CheckCircle2,
  ClipboardList,
  EyeOff,
  Package,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ModerationHistoryTable } from '@/features/product/components/moderation-history-table'
import {
  useAllModerationHistory,
  useProductQueue,
} from '@/features/product/hooks/use-products'
import { StatCard } from './components/stat-card'
import { useProductCount, useUserCounts } from './hooks/use-dashboard-stats'

// Enough decisions to show whether the queue is moving without turning the
// landing page into the moderation log, which has its own page.
const RECENT_ACTIVITY_LIMIT = 5

export default function Dashboard() {
  // One row per query: these calls exist for their pagination meta, not their
  // payload. See dashboard-api for why there is no stats endpoint to ask.
  const queue = useProductQueue({ limit: 1 })
  const total = useProductCount()
  const approved = useProductCount('approved')
  const rejected = useProductCount('rejected')
  const users = useUserCounts()
  const recent = useAllModerationHistory({ limit: RECENT_ACTIVITY_LIMIT })

  // The pending queue and a status=pending count are the same COUNT over the
  // same rows, so the queue answers for both tiles and saves a request. Using
  // the queue endpoint also guarantees this number matches the page it links
  // to, which is the one promise a landing-page count has to keep.
  const pendingCount = queue.data?.meta?.total_items

  // Neither `hidden` nor `resubmitted` can be asked for: the list endpoint
  // rejects any status outside approved/pending/rejected. What is left over
  // from the unfiltered total is therefore those two together, and it is only
  // meaningful when every part of the subtraction actually arrived.
  const accountedFor =
    total.data !== undefined &&
    approved.data !== undefined &&
    rejected.data !== undefined &&
    pendingCount !== undefined
  const otherCount = accountedFor
    ? Math.max(0, total.data - approved.data - rejected.data - pendingCount)
    : undefined
  const otherIsPending =
    total.isPending ||
    approved.isPending ||
    rejected.isPending ||
    queue.isPending
  const otherIsError =
    total.isError ||
    approved.isError ||
    rejected.isError ||
    queue.isError ||
    (!otherIsPending && !accountedFor)

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
            <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
            <p className='text-muted-foreground'>
              What needs a moderator right now across LokaLaunch.
            </p>
          </div>
        </div>

        <div className='flex-1 space-y-6 py-1'>
          <section className='grid gap-4 sm:grid-cols-2'>
            <StatCard
              title='Waiting for review'
              value={pendingCount}
              isPending={queue.isPending}
              isError={queue.isError}
              icon={<ClipboardList className='size-4' />}
              hint='Products submitted and not yet decided. Open the queue.'
              emptyHint='Queue is clear. Nothing is waiting on a decision.'
              to='/products/queue'
              emphasis
            />
            <StatCard
              title='Waiting for alpha approval'
              value={users.data?.awaitingApproval}
              isPending={users.isPending}
              isError={users.isError}
              icon={<UserCheck className='size-4' />}
              hint={
                users.data?.isPartialScan
                  ? 'At least this many. Signed up but cannot log in until approved.'
                  : 'Signed up but cannot log in until approved.'
              }
              emptyHint='Nobody is on the waitlist.'
              to='/users'
              emphasis
            />
          </section>

          <section className='space-y-3'>
            <h3 className='text-sm font-semibold tracking-tight'>
              Products by status
            </h3>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
              <StatCard
                title='Total'
                value={total.data}
                isPending={total.isPending}
                isError={total.isError}
                icon={<Package className='size-4' />}
                emptyHint='No products submitted yet.'
                to='/products/list'
              />
              <StatCard
                title='Approved'
                value={approved.data}
                isPending={approved.isPending}
                isError={approved.isError}
                icon={<CheckCircle2 className='size-4' />}
                emptyHint='Nothing published yet.'
              />
              <StatCard
                title='Pending'
                value={pendingCount}
                isPending={queue.isPending}
                isError={queue.isError}
                icon={<ClipboardList className='size-4' />}
                emptyHint='None pending.'
                to='/products/queue'
              />
              <StatCard
                title='Rejected'
                value={rejected.data}
                isPending={rejected.isPending}
                isError={rejected.isError}
                icon={<XCircle className='size-4' />}
                emptyHint='Nothing rejected.'
              />
              <StatCard
                title='Hidden or resubmitted'
                value={otherCount}
                isPending={otherIsPending}
                isError={otherIsError}
                icon={<EyeOff className='size-4' />}
                hint='Counted as the remainder. The API cannot filter these two apart.'
                emptyHint='Nothing hidden or resubmitted.'
              />
            </div>
          </section>

          <section className='space-y-3'>
            <h3 className='text-sm font-semibold tracking-tight'>People</h3>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
              <StatCard
                title='Total users'
                value={users.data?.total}
                isPending={users.isPending}
                isError={users.isError}
                icon={<Users className='size-4' />}
                emptyHint='No accounts yet.'
                to='/users'
              />
            </div>
          </section>

          <section className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold tracking-tight'>
                Recent moderation activity
              </h3>
              <Button asChild variant='outline' size='sm'>
                <Link to='/products/moderation-log'>View full log</Link>
              </Button>
            </div>
            <ModerationHistoryTable
              items={recent.data?.data ?? []}
              // The table's prop is named isLoading but wants the pending
              // semantics: fed query.isLoading it goes false during retry
              // backoff and the table falls through to "No moderation history
              // yet", which claims an empty log when the truth is that the
              // request has not settled. The other two screens using this
              // table still pass isLoading and have the same latent bug.
              isLoading={recent.isPending}
              error={recent.error as Error | null}
              showProduct
            />
          </section>
        </div>
      </Main>
    </>
  )
}
