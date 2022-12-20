"use client";

import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/navbar/sidebar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, toggleSidebar] = useState(false);

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <html lang="en">
        <head>
          <title>Nilfheim</title>
        </head>
        <body className="bg-slate-900">
          <Navbar open={open} toggleSidebar={toggleSidebar} />
          <div>
            <div className="absolute">
              <div className="p-4">{children}</div>
            </div>
            <div className="absolute z-10">
              <Sidebar open={open} toggleOpen={toggleSidebar} />
            </div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
