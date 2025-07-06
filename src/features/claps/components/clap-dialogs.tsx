import { useClaps } from '../stores/clapsStore'
import { ClapIncrementDialog } from './clap-increment-dialog'
import { ClapReduceDialog } from './clap-reduce-dialog'
import { ClapSetZeroDialog } from './clap-set-zero-dialog'

export function ClapDialogs() {
  const { open, setOpen, currentClap, setCurrentClap } = useClaps()

  const handleCloseDialog = () => {
    setOpen(null)
    // Add a small delay before clearing the current clap to allow animations to complete
    setTimeout(() => {
      setCurrentClap(null)
    }, 500)
  }

  if (!currentClap) return null

  return (
    <>
      <ClapSetZeroDialog
        open={open === 'setToZero'}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog()
        }}
        clap={currentClap}
      />

      <ClapReduceDialog
        open={open === 'reduce'}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog()
        }}
        clap={currentClap}
      />

      <ClapIncrementDialog
        open={open === 'increment'}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog()
        }}
        clap={currentClap}
      />
    </>
  )
}
