"use client";

import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/navbar/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <html lang="en">
        <head>
          <title>Nilfheim</title>
        </head>
        <body className="bg-slate-900">
          <Navbar />
          <div>
            <div className="absolute">
              <div className="p-4">{children}</div>
            </div>
            <div className="absolute z-10">
              <Sidebar />
            </div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
