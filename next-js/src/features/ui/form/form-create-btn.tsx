"use client";

interface Props {
  onClick: () => void;
}

export default function FormCreateButton({ onClick }: Props) {
  return (
    <button
      type="button"
      className="p-1 bg-gray-600 rounded-sm"
      onClick={onClick}
    >
      Create
    </button>
  );
}
