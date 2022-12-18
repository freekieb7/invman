"use client";

import { UserCircleIcon } from "@heroicons/react/24/solid";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body className="bg-slate-900">
        <div className="flex items-center justify-items-center justify-between p-2 bg-slate-500">
          <div className="w-64">
            <h1 className="neonText">Nilfheim</h1>
          </div>
          <div className="">
            <a>
              <UserCircleIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="bg-slate-300">
          <SessionProvider refetchOnWindowFocus={false}>
            <>{children}</>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
