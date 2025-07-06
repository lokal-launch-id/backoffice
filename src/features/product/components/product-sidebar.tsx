import ProductDecisionOption from './product-decision-option'
import { ProductHistoryList } from './product-history-list'

export function ProductSidebar() {
  return (
    <div className='space-y-4'>
      <ProductDecisionOption />
      <ProductHistoryList />
    </div>
  )
}
