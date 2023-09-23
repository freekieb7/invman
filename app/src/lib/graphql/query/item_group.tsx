import { gql } from "../__generated__";

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