"use client";

import './layout.css'

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Navbar from '@/component/core/navbar';
import Sessionbar from '@/component/core/sessionbar';
import { NextUIProvider } from '@nextui-org/react';
import GraphqlProvider from '@/lib/graphql/provider';

export default function Layout({ children, session }: { children: React.ReactNode, session: Session | null }) {
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <head>
          <title>Invman</title>
        </head>
        <body className="text-slate-100">
          <NextUIProvider>
            <main className="dark text-foreground bg-background min-h-screen">
              <div className='fixed h-full w-20 p-2 z-40'>
                <Navbar />
              </div>
              <div className='fixed w-full z-30'>
                <div className='ml-20 h-20 p-2'>
                  <Sessionbar />
                </div>
              </div>
              <div className='ml-20 pt-20 z-10'>
                <div className='p-2'>
                  <GraphqlProvider>
                    {children}
                  </GraphqlProvider>
                </div>
              </div>
            </main>
          </NextUIProvider>
        </body>
      </html>
    </SessionProvider >
  );
}
