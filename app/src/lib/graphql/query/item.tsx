import { gql } from "../__generated__";

export const GET_ITEMS = gql(`
query GET_ITEMS($limit: Int, $offset: Int) {
  items(limit: $limit, offset: $offset) {
    id
    createdAt
    updatedAt
  }
}
`);

export const GET_ITEM = gql(`
query GET_ITEM($id: ID!) {
  item(id: $id) {
    id
    group {
      id
      name
      attributes {
        specific {
          fields{
            id
            name
            type
            value
          }
        }
      }
      createdAt
      updatedAt
    }
    attributes{
      specific {
        fields {
          id
          name
          type
          value  
        }  
      }
    }
    createdAt
    updatedAt
  }
}
`);

export const CREATE_ITEM = gql(`
  mutation CREATE_ITEM($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      group {
        id
        name
        attributes{
          specific {
            fields {
              id
              name
              type
              value
            }
          }
        }
        createdAt
        updatedAt
      }
      createdAt
      attributes {
        specific {
          fields {
            id
            name
            type
            value
          }
        }
      }
    }
  }
`);

// export const DELETE_SERVICE = gql(`
//   mutation DeleteService($id: String!) {
//     deleteService(id: $id)
//   }
// `);