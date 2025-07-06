import { create } from 'zustand'
import { Clap } from '../data/schema'

type ClapDialogType = 'setToZero' | 'reduce' | 'increment'

interface ClapsState {
  // Dialog state
  open: ClapDialogType | null
  currentClap: Clap | null

  // Actions
  setOpen: (type: ClapDialogType | null) => void
  setCurrentClap: (clap: Clap | null) => void
  reset: () => void
}

export const useClapsStore = create<ClapsState>((set) => ({
  // Initial state
  open: null,
  currentClap: null,

  // Actions
  setOpen: (type) => set({ open: type }),
  setCurrentClap: (clap) => set({ currentClap: clap }),
  reset: () => set({ open: null, currentClap: null }),
}))

// Export hook for easier usage
export const useClaps = () => useClapsStore()
