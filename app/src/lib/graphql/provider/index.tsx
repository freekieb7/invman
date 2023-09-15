"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";

const client = new ApolloClient({
    uri: 'http://api.localhost/',
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    items: offsetLimitPagination(),
                },
            },
        },
    }),

});

const GraphqlProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};

export default GraphqlProvider