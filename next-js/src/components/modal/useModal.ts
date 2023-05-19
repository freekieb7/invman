import { useContext } from 'react'
import { ModalContext } from './modal'

// Custom hook to trigger the snackbar on function components
export const useModal = () => {
  const { openModal, closeModal } = useContext(ModalContext)

  // If no correct position is passed, 'bottom-center' is set
  // if (!positions.includes(position)) {
  //   position = defaultPosition
  // }

  function open(children: React.ReactNode) {
    openModal(children);
  }

  // Returns methods in hooks array way
  return [open, closeModal]
}