"use client";

import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useSession, signOut, signIn } from "next-auth/react";

import Image from "next/image";

export default function ProfileButton() {
  const { data: session } = useSession();

  if (session == null)
    return (
      <UserCircleIcon
        onClick={() => signIn()}
        className="bg-slate-50 h-6 w-6 hover:bg-slate-800 rounded"
      />
    );

  return (
    <button onClick={() => signOut()}>
      <Image
        src={session!.user!.image!}
        alt="image"
        width={32}
        height={32}
        style={{
          objectFit: "cover",
          borderRadius: "50px",
        }}
      />
    </button>
  );
}
