"use client";

import { useSession, signIn, signOut } from "next-auth/react";

import Image from "next/image";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()}>
        <Image
          src={session.user!.image!}
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

  return (
    <button
      className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
      onClick={() => signIn()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>
  );
}
