import { gql } from "../__generated__";

export const GET_ITEMS = gql(`
query GET_ITEMS($limit: Int!, $offset: Int, $filters: [ItemsFilter!]) {
  items(limit: $limit, offset: $offset, filters: $filters) {
    id
    pid
    createdAt
    updatedAt
    localCustomFields {
        ... on TextCustomField {
            value
            onEmptyValue
            field {
                id
                name
            }
        }
    }
    globalCustomFields {
        ... on TextCustomField {
            value
            onEmptyValue
            field {
                id
                name
            }
        }
    }
    group {
        id
        name
        createdAt
        updatedAt
    }
  }
}
`);

export const GET_ITEM = gql(`
query GET_ITEM($id: ID!) {
  item(id: $id) {
    id
    pid
    group {
      id
      name
      createdAt
      updatedAt
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
    }
  }
`);

export const DELETE_ITEM = gql(`
  mutation DELETE_ITEM($id: ID!) {
    deleteItem(id: $id)
  }
`);