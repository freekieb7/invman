"use client";

import { TrashIcon } from "@heroicons/react/24/solid";

type Props = {
  isLoading: boolean;
  onClick: () => void;
};

export default function FormDeleteBtn({ isLoading, onClick }: Props) {
  return (
    <button
      type="button"
      className="p-1 bg-indigo-900 text-slate-100 rounded-sm flex items-center justify-center min-h-8 h-full disabled:bg-indigo-800"
      onClick={onClick}
      disabled={isLoading}
    >
      <TrashIcon className="h-4 w-4" />
      <div className="pl-2">Delete</div>
    </button>
  );
}
