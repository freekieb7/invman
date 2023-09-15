import { gql } from "../__generated__";

export const GET_ITEMS = gql(`
query GetItems($limit: Int, $offset: Int) {
  items(limit: $limit, offset: $offset) {
    id
    createdAt
    updatedAt
  }
}
`);

// export const CREATE_SERVICE = gql(`
//   mutation CreateService($name: String!) {
//     createService(input: { name: $name }) {
//       id
//       name
//       createdAt
//       updatedAt
//     }
//   }
// `);

// export const DELETE_SERVICE = gql(`
//   mutation DeleteService($id: String!) {
//     deleteService(id: $id)
//   }
// `);