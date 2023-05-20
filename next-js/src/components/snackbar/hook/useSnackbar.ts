import { useContext } from 'react'
import { SnackbarContext, defaultDuration } from '../snackbar'

// Custom hook to trigger the snackbar on function components
export const useSnackbar = () => {
  const { openSnackbar, closeSnackbar } = useContext(SnackbarContext)

  // If no correct position is passed, 'bottom-center' is set
  // if (!positions.includes(position)) {
  //   position = defaultPosition
  // }

  function open(text = '', duration = defaultDuration) {
    openSnackbar(text, duration)
  }

  // Returns methods in hooks array way
  return [open, closeSnackbar]
}