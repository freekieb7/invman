import { gql } from "__generated__";

export const GET_SERVICES = gql(`
  query GetServices($cursor: String, $maxResults: Int) {
    services(cursor: $cursor, maxResults: $maxResults) {
      uuid
      name
      createdAt
      updatedAt
    }
  }
`);

export const CREATE_SERVICE = gql(/* GraphQL */ `
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
