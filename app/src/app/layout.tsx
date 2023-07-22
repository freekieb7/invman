"use client";

import "@/styles/globals.css";

import type { NextWebVitalsMetric } from 'next/app'
import { SessionProvider, getSession } from "next-auth/react";
import { StrictMode, useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import SnackbarContextProvider from "@/features/general/snackbar/Snackbar";
import Navbar from "@/features/general/nav/Navbar";
import ModalContextProvider from "@/features/general/modal/Modal";
import SidebarLargeScreen from "@/features/general/nav/SidebarLargeScreen";
import SidebarSmallScreen from "@/features/general/nav/SidebarSmallScreen";
import { setContext } from '@apollo/client/link/context';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        services: {
          keyArgs: [
            "input",
            ["uuid", "name", "createdAt", "updatedAt", "order"],
          ],
          merge(existing, incoming, { args }) {
            const merged = existing ? existing.slice(0) : [];

            if (incoming) {
              if (args) {
                // Assume an offset of 0 if args.offset omitted.
                const { offset = 0 } = args.input;
                for (let i = 0; i < incoming.length; ++i) {
                  merged[offset + i] = incoming[i];
                }
              } else {
                merged.push.apply(merged, incoming);
              }
            }

            return merged;
          },
        },
      },
    },
  },
});


const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/query`,
});

const authLink = setContext(async (_, { headers }) => {
  // const { data: session } = useSession();

  const session = await getSession();

  return {
    headers: {
      ...headers,
      authorization: session ? `Bearer ${session!.user.token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, toggleSidebar] = useState(false);

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <StrictMode>
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
      </StrictMode>
    </SessionProvider>
  );
}
