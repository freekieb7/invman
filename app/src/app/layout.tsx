"use client";

import './global.css';

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Navbar from '@/component/core/navbar';
import { NextUIProvider } from '@nextui-org/react';
import GraphqlProvider from '@/lib/graphql/provider';
import ProfileAvatar from '@/component/profile/avatar';
import { useState } from 'react';
import { SnackbarProvider } from 'notistack';

export default function Layout({ children, session }: { children: React.ReactNode, session: Session | null }) {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

  return (
    <SessionProvider session={session}>
      <html lang="en" className={isDarkTheme ? "dark" : "light"}>
        <head>
          <script>
            let FF_FOUC_FIX;
          </script>
          <title>Invman</title>
        </head>

        <body>
          <NextUIProvider>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom"
              }}
            >
              <main className="min-h-screen">
                <div className='glass border-b border-default/50 fixed w-full z-40 h-16 px-4'>
                  <div className="flex h-full gap-6 items-center justify-end p-2">
                    <div className='h-10 w-10 flex items-center justify-center'>
                      <ProfileAvatar
                        isDarkTheme={isDarkTheme}
                        setIsDarkTheme={setIsDarkTheme}
                      />
                    </div>
                  </div>
                </div>
                <div className='glass border-r border-default/50 fixed h-full z-30 w-16 mt-16'>
                  <Navbar />
                </div>
                <div className='ml-16 pt-16 z-10 absolute top-0 left-0 right-0 bottom-0'>
                  <div className='p-4 flex flex-col h-full overflow-auto'>
                    <GraphqlProvider>
                      {children}
                    </GraphqlProvider>
                  </div>
                </div>
              </main>
            </SnackbarProvider>
          </NextUIProvider>
        </body>
      </html>
    </SessionProvider >
  );
};