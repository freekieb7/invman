"use client";

import './layout.css'

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Navbar from '@/component/core/navbar';
import { NextUIProvider, Switch } from '@nextui-org/react';
import GraphqlProvider from '@/lib/graphql/provider';
import NotificationBell from '@/component/notification/bell';
import ProfileAvatar from '@/component/profile/avatar';
import { useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function Layout({ children, session }: { children: React.ReactNode, session: Session | null }) {
  const [isSelected, setIsSelected] = useState<boolean>(true);

  return (
    <SessionProvider session={session}>
      <html lang="en" className={isSelected ? "dark" : "light"}>
        <head>
          <script>
            let FF_FOUC_FIX;
          </script>
          <title>Invman</title>
        </head>

        <body>
          <NextUIProvider>
            <main className="max-h-screen">
              <div className='fixed w-full z-40 h-16 px-4 border-b border-default-100'>
                <div className="flex gap-6 items-center justify-end p-2">
                  <Switch
                    defaultSelected
                    color='default'
                    thumbIcon={({ isSelected, className }) =>
                      isSelected ? (
                        <MoonIcon className={className} />
                      ) : (
                        <SunIcon className={className} />
                      )
                    }
                    onValueChange={setIsSelected}
                  />
                  <div className="w-8 h-8">
                    <NotificationBell />
                  </div>
                  <div className="w-12 h-12">
                    <ProfileAvatar />
                  </div>
                </div>
              </div>
              <div className='fixed h-full z-30 w-16 mt-16 border-r border-default-100'>
                <Navbar />
              </div>
              <div className='ml-16 pt-16 z-10'>
                <div className='p-4 flex flex-col h-full overflow-auto'>
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
