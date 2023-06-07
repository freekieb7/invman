"use client";

import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import SnackbarContextProvider from "@/features/general/snackbar/Snackbar";
import Navbar from "@/features/general/nav/Navbar";
import ModalContextProvider from "@/features/general/modal/Modal";
import SidebarLargeScreen from "@/features/general/nav/SidebarLargeScreen";
import SidebarSmallScreen from "@/features/general/nav/SidebarSmallScreen";
import { offsetLimitPagination } from "@apollo/client/utilities";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        services: offsetLimitPagination(),
      },
    },
  },
});

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/query`,
  cache: cache,
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
              </SnackbarContextProvider>
            </div>
          </body>
        </html>
      </ApolloProvider>
    </SessionProvider>
  );
}
