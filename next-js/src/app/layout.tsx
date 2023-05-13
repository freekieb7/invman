"use client";

import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/nav/navbar";
import Sidebar from "@/components/nav/sidebar";
import { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { HomeIcon } from "@heroicons/react/24/solid";

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
          <body className="bg-slate-900 min-h-full">
            <Navbar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
            <Sidebar isOpen={isSidebarOpen} />
            {isSidebarOpen ? (
              <div
                onClick={() => toggleSidebar(false)}
                className="fixed w-full h-screen z-1 bg-gray-700 opacity-75"
              ></div>
            ) : null}

            <div className={isSidebarOpen ? "lg:pl-64" : ""}>{children}</div>
          </body>
        </html>
      </ApolloProvider>
    </SessionProvider>
  );
}
