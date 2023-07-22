"use client";

import SpinnerSmall from "@/features/general/spinner/SpinnerSmall";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import { useSession, signOut } from "next-auth/react";

import Image from "next/image";

export default function ProfileButton() {
  const { data: session } = useSession();

  if (session == null) return <SpinnerSmall />;

  return (
    <button onClick={() => signOut()}>
      {typeof session.user?.image === 'string' && session.user.image !== "" ?
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
       :
        <UserIcon 
          height={32} 
          color="white"
          className="slate-100 bg-slate-700 rounded-full object-cover"
        />
      }
    </button>
  );
}
