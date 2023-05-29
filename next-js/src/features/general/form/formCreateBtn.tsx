"use client";

import { CheckIcon } from "@heroicons/react/24/solid";
import SpinnerTiny from "../spinner/spinnerTiny";

interface Props {
  isLoading: boolean;
  onClick: () => void;
}

export default function FormCreateBtn({ onClick, isLoading }: Props) {
  return (
    <button
      type="button"
      className="p-1 bg-indigo-700 text-slate-100 rounded-sm flex items-center justify-center min-h-8 h-full disabled:bg-indigo-800"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <SpinnerTiny />
      ) : (
        <>
          <CheckIcon className="h-4 w-4" />
          <div className="pl-2">Create</div>
        </>
      )}
    </button>
  );
}
