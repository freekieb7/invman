"use client";

import { fetchServices } from "./actions";

import { gql, useQuery } from "@apollo/client";

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

export default function Services() {
  const { loading, error, data } = useQuery(GET_DOGS);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error! ${error.message}</div>;

  console.log(data);

  return (
    <div>
      <button onClick={async () => fetchServices()}>Get services</button>
    </div>
  );
}
