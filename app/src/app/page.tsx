"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  return <h1 className="text-white">Content</h1>;
}
