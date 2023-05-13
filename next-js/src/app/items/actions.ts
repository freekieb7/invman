"use server";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// TODO remove
const client = new ApolloClient({
  uri: "http://graphql:8080/query",
  cache: new InMemoryCache(),
});

export async function fetchServices() {
  client.query({
      query: gql`
        query {
          services {
            id
            name
            createdAt
            updatedAt
          }
        }
      `,
    }).then((result) => console.log(result.data));
}