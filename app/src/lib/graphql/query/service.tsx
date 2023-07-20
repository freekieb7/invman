import { gql } from "../__generated__";

export const GET_SERVICES = gql(`
query Services($input: ServicesInput!) {
  services(input: $input) {
    uuid
    name
    createdAt
    updatedAt
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
