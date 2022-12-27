"use client";

import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/nav/navbar";
import Sidebar from "@/components/nav/sidebar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, toggleSidebar] = useState(false);

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <html lang="en">
        <head>
          <title>Nilfheim</title>
        </head>
        <body className="bg-slate-900">
          <Navbar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isOpen} toggleOpen={toggleSidebar} />
          <div className="p-4">{children}</div>
        </body>
      </html>
    </SessionProvider>
  );
}
