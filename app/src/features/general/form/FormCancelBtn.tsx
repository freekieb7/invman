"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  isLoading: boolean;
  onClick: () => void;
};

export default function FormCancelBtn({ isLoading, onClick }: Props) {
  // TODO add disabled style
  return (
    <button
      type="button"
      className="p-1 bg-gray-700 text-slate-100 rounded-sm flex items-center justify-center min-h-8 h-full disabled:bg-gray-800"
      onClick={onClick}
      disabled={isLoading}
    >
      <XMarkIcon className="h-4 w-4" />
      <div className="pl-2">Cancel</div>
    </button>
  );
}
