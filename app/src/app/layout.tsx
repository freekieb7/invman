"use client";

import './global.css'

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import ProfileButton from '@/component/profile/button';
import { BookOpenIcon, HomeIcon } from '@heroicons/react/24/solid';
import Navbar from '@/component/core/navbar';
import Sessionbar from '@/component/core/sessionbar';

export default function Layout({ children, session }: { children: React.ReactNode, session: Session | null }) {
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <head>
          <title>Invman</title>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
          <script src="/rain.js"></script>
        </head>
        <body className="text-slate-100">
          <canvas id="canvas" className="-z-[9999] w-full h-full fixed bg-cover bg-fixed bg-[url('/background.png')]" suppressHydrationWarning={true} />
          <div className='fixed h-full p-4 w-24'>
            <Navbar />
          </div>
          <div className='ml-24'>
            <Sessionbar />
            {children}
          </div>
        </body>
      </html>
    </SessionProvider >
  );
}
