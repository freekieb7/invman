"use client";

import { useRouter } from "next/navigation";

export default function CancelButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="p-1 bg-gray-600 rounded-sm"
      onClick={() => router.back()}
    >
      Cancel
    </button>
  );
}
