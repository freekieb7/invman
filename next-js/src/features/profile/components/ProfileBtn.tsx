"use client";

import SpinnerSmall from "@/features/general/spinner/SpinnerSmall";
import { useSession, signOut } from "next-auth/react";

import Image from "next/image";

export default function ProfileButton() {
  const { data: session } = useSession();

  if (session == null) return <SpinnerSmall />;

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
