"use client";

import './global.css';

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
            <main className="min-h-screen">
              <div className='glass border-b border-default/50 fixed w-full z-40 h-16 px-4'>
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
          </NextUIProvider>
        </body>
      </html>
    </SessionProvider >
  );
}
