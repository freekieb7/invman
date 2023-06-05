import { gql } from "../__generated__";

export const GET_SERVICES = gql(`
query Services($first: Int, $after: String, $last: Int, $before: String, $order: ServiceOrder!) {
  services(first: $first, after: $after, last: $last, before: $before, order: $order) {
      pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
      }
      edges {
          cursor
          node {
              uuid
              name
              createdAt
              updatedAt
          }
      }
  }
}
`);

export const CREATE_SERVICE = gql(`
  mutation CreateService($name: String!) {
    createService(input: { name: $name }) {
      uuid
      name
      createdAt
      updatedAt
    }
  }
`);

export const DELETE_SERVICE = gql(`
  mutation DeleteService($uuid: String!) {
    deleteService(uuid: $uuid)
  }
`);
