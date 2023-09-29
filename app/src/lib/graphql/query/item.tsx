import { gql } from "../__generated__";

export const GET_ITEMS = gql(`
query GET_ITEMS($limit: Int!, $offset: Int, $filters: [ItemsFilter!]) {
  items(limit: $limit, offset: $offset, filters: $filters) {
    id
    pid
    group {
      id
      name
    }
    customFields {
      ... on TextCustomField{
        id
        name
        onEmptyStringValue: onEmptyValue
        stringValue: value
      }
      ... on IntegerCustomField{
        id
        name
        onEmptyIntegerValue: onEmptyValue
        integerValue: value
      }
    }
    createdAt
    updatedAt
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
    customFields {
      ... on TextCustomField{
        id
        name
        onEmptyStringValue: onEmptyValue
        stringValue: value
      }
      ... on IntegerCustomField{
        id
        name
        onEmptyIntegerValue: onEmptyValue
        integerValue: value
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
    }
  }
`);

export const DELETE_ITEM = gql(`
  mutation DELETE_ITEM($id: ID!) {
    deleteItem(id: $id)
  }
`);