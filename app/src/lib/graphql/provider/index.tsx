"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const GraphqlProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();

    const client = useMemo(
        () => new ApolloClient({
            uri: 'http://api.localhost/',
            headers: {
                authorization: session ? `Bearer ${session!.user.access_token}` : "",
            },
            connectToDevTools: true,
            cache: new InMemoryCache({
                typePolicies: {
                    Query: {
                        fields: {
                            items: offsetLimitPagination(),
                            itemGroups: offsetLimitPagination(["filters"]),
                        },
                    },
                },
            }),
        }),
        [session]
    );

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};

export default GraphqlProvider