import React, { createContext, useState } from "react";

import "./snackbar.css";

// Snackbar default values
export const defaultPosition = "bottom-center";
export const defaultDuration = 5000;
export const defaultInterval = 250;
// export const positions = [
//   "top-left",
//   "top-center",
//   "top-right",
//   "bottom-left",
//   "bottom-center",
//   "bottom-right",
// ];

export const SnackbarContext = createContext({
  openSnackbar: (
    text: string,
    duration: number
    // position: string,
  ) => {},
  closeSnackbar: () => {},
});

export default function SnackbarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Current open state
  const [open, setOpen] = useState<boolean>(false);
  // Snackbar's text
  const [text, setText] = useState("");
  // Snackbar's duration
  const [duration, setDuration] = useState<number>(defaultDuration);
  // Snackbar's position
  // const [position, setPosition] = useState<string>(defaultPosition);

  const triggerSnackbar = (
    text: string,
    duration: number
    // position: string
  ) => {
    setText(text);
    setDuration(duration);
    // setPosition(position);
    setOpen(true);
    setTimeout(() => setOpen(false), duration);
  };

  // Manages all the snackbar's opening process
  const openSnackbar = (text: string, duration: number) => {
    // Closes the snackbar if it is already open
    if (open === true) {
      setOpen(false);
      setTimeout(() => {
        triggerSnackbar(text, duration);
      }, defaultInterval);
    } else {
      triggerSnackbar(text, duration);
    }
  };

  // Closes the snackbar just by setting the "open" state to false
  const closeSnackbar = () => {
    setOpen(false);
  };

  // Returns the Provider that must wrap the application
  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}

      {/* Renders Snackbar on the end of the page */}
      {open ? (
        <div className="snackbar__container">
          <div className="snackbar__label">{text}</div>
          <div className="snackbar__dismiss" onClick={closeSnackbar}>
            &times;
          </div>
        </div>
      ) : null}
    </SnackbarContext.Provider>
  );
}
