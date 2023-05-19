import React, { createContext, useState } from "react";

import "./modal.css";

export const ModalContext = createContext({
  openModal: (children: React.ReactNode) => {},
  closeModal: () => {},
});

export default function ModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [modalChildren, setChildren] = useState<React.ReactNode>();

  const triggerModal = (
    children: React.ReactNode
    // position: string
  ) => {
    setChildren(children);
    setOpen(true);
  };

  const openModal = (children: React.ReactNode) => {
    // Updates the modal if it is already open
    if (open === true) {
      setOpen(false);
    } else {
      // Update
      triggerModal(children);
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  // Returns the Provider that must wrap the application
  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Renders Snackbar on the end of the page */}
      {open ? (
        <div className="absolute top-0 bottom-0 left-0 right-0">
          <div className="flex items-center justify-center w-full h-full">
            <div
              id="modal-shade"
              className="fixed w-full h-full bg-gray-700/75"
              onClick={closeModal}
            ></div>
            <div className="fixed z-40 flex items-center justify-center bg-slate-50">
              {modalChildren}
            </div>
          </div>

          {/* <div className="relative top-0 bottom-0 z-1 flex flex-col items-center justify-center">
            <div className="bg-slate-50">{modalChildren}</div>
            <div className="bg-slate-50">{modalChildren}</div>
            <div className="bg-slate-50">{modalChildren}</div>
            <div className="bg-slate-50">{modalChildren}</div>
            <div className="bg-slate-50">{modalChildren}</div>
            <div className="bg-slate-50">{modalChildren}</div>
            <div className="bg-slate-50">{modalChildren}</div>
            <div className="bg-slate-50">{modalChildren}</div>
            <div className="bg-slate-50">{modalChildren}</div>
          </div> */}
        </div>
      ) : null}
    </ModalContext.Provider>
  );
}
