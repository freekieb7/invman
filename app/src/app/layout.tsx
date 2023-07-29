"use client";

import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { StrictMode, useState } from "react";
import SnackbarContextProvider from "@/features/general/snackbar/Snackbar";
import Navbar from "@/features/general/nav/Navbar";
import ModalContextProvider from "@/features/general/modal/Modal";
import SidebarLargeScreen from "@/features/general/nav/SidebarLargeScreen";
import SidebarSmallScreen from "@/features/general/nav/SidebarSmallScreen";
import { Session } from "next-auth";
import { GraphqlApiProvider } from "@/features/api/GraphqlApiProvider";


export default function Layout({ children, session }: { children: React.ReactNode, session: Session | null }) {

  return (
    <SessionProvider session={session}>
      <StrictMode>
        <html lang="en">
          <head>
            <title>Invman</title>
          </head>
          <body className="text-white">
            <div className="min-h-full block absolute left-0 right-0 top-0 bg-slate-900">
              <SnackbarContextProvider>
                <NavLayout>
                  <GraphqlApiProvider>
                    {children}
                  </GraphqlApiProvider>
                </NavLayout>
              </SnackbarContextProvider>
            </div>
          </body>
        </html>
      </StrictMode>
    </SessionProvider>
  );
}

export const NavLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, toggleSidebar] = useState(false);

  return (
    <div id="content" className="">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <SidebarLargeScreen
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <SidebarSmallScreen
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        id="child"
        className={
          isSidebarOpen
            ? "fixed h-full bottom-0 top-0 right-0 left-0 z-20 mt-16 lg:ml-60"
            : "fixed h-full bottom-0 top-0 right-0 left-0 z-20 mt-16 ml-12"
        }
      >
        <ModalContextProvider>
          <div className="p-4">{children}</div>
        </ModalContextProvider>
      </div>
    </div>
  )
};