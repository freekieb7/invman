"use server";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://graphql:8080/query",
  cache: new InMemoryCache(),
});

const GET_DOGS = gql`
  query {
    services {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

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