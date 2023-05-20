import { useContext } from 'react'
import { ModalContext } from '../modal'

interface ModalContext {
  open: (children: React.ReactNode) => void;
  close: () => void;
}

export const useModal = () => {
  const { openModal, closeModal } = useContext(ModalContext);

  return [openModal, closeModal] as [typeof openModal, typeof closeModal];
}