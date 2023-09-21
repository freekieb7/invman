import { gql } from "../__generated__";

export const GET_ITEM_GROUPS = gql(`
    query GET_ITEM_GROUPS($limit: Int!, $offset: Int, $filter: ItemGroupsFilter) {
    itemGroups(limit: $limit, offset: $offset, filter: $filter) {
        id
        name
        createdAt
        updatedAt
    }
    }
`);