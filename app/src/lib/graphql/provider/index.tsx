"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";

const client = (accessToken: string) => new ApolloClient({
    uri: 'http://api.localhost',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
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
});


const GraphqlProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();

    if (session?.user.access_token == null) return <div className="h-full flex justify-center items-center"><Spinner /></div>

    return (
        <ApolloProvider client={client(session.user.access_token!)}>
            {children}
        </ApolloProvider>
    );
};

export default GraphqlProvider