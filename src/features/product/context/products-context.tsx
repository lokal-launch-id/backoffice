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

const ProductContext = React.createContext<ProductsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProductsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )

  // Use the product hook to fetch data
  const {
    data: selectedProduct,
    isLoading: isLoadingProduct,
    error,
  } = useProduct(selectedProductId)

  return (
    <ProductContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        selectedProductId,
        setSelectedProductId,
        selectedProduct: selectedProduct || null,
        isLoadingProduct,
        error: error as Error | null,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const productsContext = React.useContext(ProductContext)

  if (!productsContext) {
    throw new Error('useProducts has to be used within <ProductContext>')
  }

  return productsContext
}
