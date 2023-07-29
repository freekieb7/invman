import { gql } from "../__generated__";

export const GET_SERVICES = gql(`
query Services($input: ServicesInput!) {
  services(input: $input) {
    id
    name
    createdAt
    updatedAt
  }
}
`);

export const CREATE_SERVICE = gql(`
  mutation CreateService($name: String!) {
    createService(input: { name: $name }) {
      id
      name
      createdAt
      updatedAt
    }
  }
`);

export const DELETE_SERVICE = gql(`
  mutation DeleteService($id: String!) {
    deleteService(id: $id)
  }
`);
