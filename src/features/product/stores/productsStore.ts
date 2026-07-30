import { create } from 'zustand'
import { Product } from '../data/schema'
import { useProduct } from '../hooks/use-products'

type ProductsDialogType = 'add' | 'edit' | 'delete' | 'hide'

interface ProductsState {
  // Dialog state
  open: ProductsDialogType | null
  currentRow: Product | null
  selectedProductId: string | null

  // Actions
  setOpen: (type: ProductsDialogType | null) => void
  setCurrentRow: (product: Product | null) => void
  setSelectedProductId: (id: string | null) => void
  reset: () => void
}

export const useProductsStore = create<ProductsState>((set) => ({
  // Initial state
  open: null,
  currentRow: null,
  selectedProductId: null,

  // Actions
  setOpen: (type) => set({ open: type }),
  setCurrentRow: (product) => set({ currentRow: product }),
  setSelectedProductId: (id) => set({ selectedProductId: id }),
  reset: () => set({ open: null, currentRow: null, selectedProductId: null }),
}))

// Hook to get selected product data with loading states
export const useSelectedProduct = () => {
  const selectedProductId = useProductsStore((state) => state.selectedProductId)
  const {
    data: selectedProduct,
    isLoading: isLoadingProduct,
    error,
  } = useProduct(selectedProductId || '')

  return {
    selectedProduct: selectedProduct || null,
    isLoadingProduct,
    error,
  }
}

// Hook to get all products state and actions
export const useProducts = () => {
  const store = useProductsStore()
  const { selectedProduct, isLoadingProduct, error } = useSelectedProduct()

  return {
    ...store,
    selectedProduct,
    isLoadingProduct,
    error,
  }
}
