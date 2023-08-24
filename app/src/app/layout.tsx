"use client";

import './global.css'

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function Layout({ children, session }: { children: React.ReactNode, session: Session | null }) {

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <head>
          <title>Invman</title>
        </head>
        <body className="text-white bg-black">
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
