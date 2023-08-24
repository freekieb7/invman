"use client";

import { signIn, useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  if (!session) return <button onClick={() => signIn("invman")}>Login</button>

  return (
    <>
      <h1 className="text-white">Contents</h1>
      {session}
    </>
  );
}
