"use client";

interface Props {
  onClick: () => void;
}

export default function FormCancelButton({ onClick }: Props) {
  return (
    <button
      type="button"
      className="p-1 bg-gray-600 rounded-sm"
      onClick={onClick}
    >
      Cancel
    </button>
  );
}
