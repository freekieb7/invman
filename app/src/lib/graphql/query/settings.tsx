import { gql } from "../__generated__";

export const GET_SETTINGS = gql(`
query GET_SETTINGS {
    settings {
        moduleInspectionsActive
      }
}
`);