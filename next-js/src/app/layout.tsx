"use client";

import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/nav/navbar";
import { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import LargeScreenSidebar from "@/components/nav/large-screen-sidebar";
import SmallScreenSidebar from "@/components/nav/small-screen-sidebar";
import SnackbarContextProvider from "@/components/snackbar/snackbar";
import ModalContextProvider from "@/components/modal/modal";

const client = new ApolloClient({
  uri: "http://api.localhost/query",
  cache: new InMemoryCache(),
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, toggleSidebar] = useState(false);

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <ApolloProvider client={client}>
        <html lang="en">
          <head>
            <title>Invman</title>
          </head>
          <body>
            <div className="min-h-full block absolute left-0 right-0 top-0 bg-slate-900">
              <SnackbarContextProvider>
                <div id="content" className="min-h-full min-w-full absolute">
                  <Navbar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                  <LargeScreenSidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                  <SmallScreenSidebar
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
                    <ModalContextProvider>{children}</ModalContextProvider>
                  </div>
                </div>
              </SnackbarContextProvider>
            </div>
          </body>
        </html>
      </ApolloProvider>
    </SessionProvider>
  );
}
