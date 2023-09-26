import { gql } from "../__generated__";

export const GET_ITEM_GROUP = gql(`
    query GET_ITEM_GROUP($id: ID!) {
        itemGroup(id: $id) {
            id
            name
            createdAt
            updatedAt
        }
    }
`);

export const GET_ITEM_GROUPS = gql(`
    query GET_ITEM_GROUPS($limit: Int!, $offset: Int, $filters: [ItemGroupsFilter!]) {
        itemGroups(limit: $limit, offset: $offset, filters: $filters) {
            id
            name
            createdAt
            updatedAt
        }
    }
`);

export const CREATE_ITEM_GROUP = gql(`
  mutation CREATE_ITEM_GROUP($input: CreateItemGroupInput!) {
    createItemGroup(input: $input) {
      id
    }
  }
`);
