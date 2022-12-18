"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function LoginButton() {
  const { data: session } = useSession();

  const myLoader = ({ url }) => {
    return session.user.image;
  };

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <Image
          alt="alt text."
          src={session.user.image}
          width={64}
          height={64}
        />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
