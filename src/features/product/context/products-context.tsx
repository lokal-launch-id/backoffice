import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Product } from '../data/schema'
import { useProduct } from '../hooks/use-products'

type ProductsDialogType = 'add' | 'edit' | 'delete'

interface ProductsContextType {
  open: ProductsDialogType | null
  setOpen: (str: ProductsDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>
  selectedProductId: string | null
  setSelectedProductId: (id: string | null) => void
  selectedProduct: Product | null
  isLoadingProduct: boolean
  error: Error | null
}

const ProductsContext = React.createContext<ProductsContextType | undefined>(
  undefined
)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )

  const {
    data: selectedProduct,
    isLoading: isLoadingProduct,
    error,
  } = useProduct(selectedProductId || '')

  return (
    <ProductsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        selectedProductId,
        setSelectedProductId,
        selectedProduct: selectedProduct || null,
        isLoadingProduct,
        error,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = React.useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}

export default ProductsProvider
