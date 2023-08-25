"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  if (!session) return <button onClick={() => signIn("invman")}>Login</button>

  return (
    <button onClick={() => signOut()}>Logout</button>
  );
}
