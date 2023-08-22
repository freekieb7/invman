"use client";

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { useSession } from "next-auth/react";
import LoadingPage from "../general/page/LoadingPage";

type Props = {
    children?: React.ReactNode;
};

export const GraphqlProvider = ({ children }: Props) => {
    const { data: session } = useSession();

    const httpLink = createHttpLink({
        uri: `${process.env.NEXT_PUBLIC_API_URL}/query`,
        // credentials: 'include'
    });

    const client = new ApolloClient({
        headers: {
            authorization: session ? `Bearer ${session!.user.access_token}` : "",
        },
        uri: `${process.env.NEXT_PUBLIC_API_URL}/query`,
        cache: cache,
    });

    if (!session) return <LoadingPage />

    return <ApolloProvider client={client}>{children}</ApolloProvider>
};

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