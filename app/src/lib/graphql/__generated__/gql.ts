/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery GET_ITEMS($limit: Int!, $offset: Int) {\n  items(limit: $limit, offset: $offset) {\n    id\n    createdAt\n    updatedAt\n  }\n}\n": types.Get_ItemsDocument,
    "\nquery GET_ITEM($id: ID!) {\n  item(id: $id) {\n    id\n    group {\n      id\n      name\n      attributes {\n        specific {\n          fields{\n            id\n            name\n            type\n            value\n          }\n        }\n      }\n      createdAt\n      updatedAt\n    }\n    attributes{\n      specific {\n        fields {\n          id\n          name\n          type\n          value  \n        }  \n      }\n    }\n    createdAt\n    updatedAt\n  }\n}\n": types.Get_ItemDocument,
    "\n  mutation CREATE_ITEM($input: CreateItemInput!) {\n    createItem(input: $input) {\n      id\n      group {\n        id\n        name\n        attributes{\n          specific {\n            fields {\n              id\n              name\n              type\n              value\n            }\n          }\n        }\n        createdAt\n        updatedAt\n      }\n      createdAt\n      attributes {\n        specific {\n          fields {\n            id\n            name\n            type\n            value\n          }\n        }\n      }\n    }\n  }\n": types.Create_ItemDocument,
    "\n  mutation DELETE_ITEM($id: ID!) {\n    deleteItem(id: $id)\n  }\n": types.Delete_ItemDocument,
    "\n    query GET_ITEM_GROUPS($limit: Int!, $offset: Int, $filter: ItemGroupsFilter) {\n    itemGroups(limit: $limit, offset: $offset, filter: $filter) {\n        id\n        name\n        createdAt\n        updatedAt\n    }\n    }\n": types.Get_Item_GroupsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GET_ITEMS($limit: Int!, $offset: Int) {\n  items(limit: $limit, offset: $offset) {\n    id\n    createdAt\n    updatedAt\n  }\n}\n"): (typeof documents)["\nquery GET_ITEMS($limit: Int!, $offset: Int) {\n  items(limit: $limit, offset: $offset) {\n    id\n    createdAt\n    updatedAt\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GET_ITEM($id: ID!) {\n  item(id: $id) {\n    id\n    group {\n      id\n      name\n      attributes {\n        specific {\n          fields{\n            id\n            name\n            type\n            value\n          }\n        }\n      }\n      createdAt\n      updatedAt\n    }\n    attributes{\n      specific {\n        fields {\n          id\n          name\n          type\n          value  \n        }  \n      }\n    }\n    createdAt\n    updatedAt\n  }\n}\n"): (typeof documents)["\nquery GET_ITEM($id: ID!) {\n  item(id: $id) {\n    id\n    group {\n      id\n      name\n      attributes {\n        specific {\n          fields{\n            id\n            name\n            type\n            value\n          }\n        }\n      }\n      createdAt\n      updatedAt\n    }\n    attributes{\n      specific {\n        fields {\n          id\n          name\n          type\n          value  \n        }  \n      }\n    }\n    createdAt\n    updatedAt\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CREATE_ITEM($input: CreateItemInput!) {\n    createItem(input: $input) {\n      id\n      group {\n        id\n        name\n        attributes{\n          specific {\n            fields {\n              id\n              name\n              type\n              value\n            }\n          }\n        }\n        createdAt\n        updatedAt\n      }\n      createdAt\n      attributes {\n        specific {\n          fields {\n            id\n            name\n            type\n            value\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CREATE_ITEM($input: CreateItemInput!) {\n    createItem(input: $input) {\n      id\n      group {\n        id\n        name\n        attributes{\n          specific {\n            fields {\n              id\n              name\n              type\n              value\n            }\n          }\n        }\n        createdAt\n        updatedAt\n      }\n      createdAt\n      attributes {\n        specific {\n          fields {\n            id\n            name\n            type\n            value\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DELETE_ITEM($id: ID!) {\n    deleteItem(id: $id)\n  }\n"): (typeof documents)["\n  mutation DELETE_ITEM($id: ID!) {\n    deleteItem(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GET_ITEM_GROUPS($limit: Int!, $offset: Int, $filter: ItemGroupsFilter) {\n    itemGroups(limit: $limit, offset: $offset, filter: $filter) {\n        id\n        name\n        createdAt\n        updatedAt\n    }\n    }\n"): (typeof documents)["\n    query GET_ITEM_GROUPS($limit: Int!, $offset: Int, $filter: ItemGroupsFilter) {\n    itemGroups(limit: $limit, offset: $offset, filter: $filter) {\n        id\n        name\n        createdAt\n        updatedAt\n    }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;