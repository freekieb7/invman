"use client";

import "@/styles/globals.css";

import { SessionProvider, useSession } from "next-auth/react";
import Navbar from "@/components/nav/navbar";
import { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import LargeScreenSidebar from "@/components/nav/large-screen-sidebar";
import SmallScreenSidebar from "@/components/nav/small-screen-sidebar";

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
            <title>Nilfheim</title>
          </head>
          <body>
            <div className="min-h-full block absolute left-0 right-0 top-0 bg-slate-900">
              <div id="content">
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
                    isSidebarOpen ? "z-20 mt-16 lg:ml-60" : "z-20 mt-16 ml-12"
                  }
                >
                  {children}
                </div>
              </div>
            </div>
          </body>
        </html>
      </ApolloProvider>
    </SessionProvider>
  );
}
