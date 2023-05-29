import React, { createContext, useState } from "react";

export const ModalContext = createContext({
  openModal: (_: React.ReactNode) => {},
  closeModal: () => {},
});

export default function ModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [modalChildren, setChildren] = useState<React.ReactNode>();

  const triggerModal = (children: React.ReactNode) => {
    setChildren(children);
    setOpen(true);
  };

  const openModal = (children: React.ReactNode) => {
    // Updates the modal if it is already open
    if (open === true) {
      setOpen(false);
    } else {
      triggerModal(children);
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {open ? (
        <div className="absolute top-0 bottom-0 left-0 right-0">
          <div className="flex items-center justify-center w-full h-full">
            <div
              id="modal-shade"
              className="fixed w-full h-full bg-gray-700/75"
              onClick={closeModal}
            ></div>
            <div className="fixed z-40 bg-neutral-800 shadow-black shadow-md text-white">
              {modalChildren}
            </div>
          </div>
        </div>
      ) : null}
    </ModalContext.Provider>
  );
}
