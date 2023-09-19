/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  Time: any;
};

export type CreateItemGroupInput = {
  attributes?: InputMaybe<ItemGroupAttributesInput>;
  name: Scalars['String'];
};

export type CreateItemInput = {
  attributes?: InputMaybe<ItemAttributesInput>;
  groupID?: InputMaybe<Scalars['ID']>;
};

export type CustomField = {
  __typename?: 'CustomField';
  id: Scalars['ID'];
  name: Scalars['String'];
  type: CustomFieldType;
  value: Scalars['String'];
};

export type CustomFieldInput = {
  name: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export enum CustomFieldType {
  Float = 'float',
  Integer = 'integer',
  String = 'string'
}

export type Item = {
  __typename?: 'Item';
  attributes?: Maybe<ItemAttributes>;
  createdAt: Scalars['DateTime'];
  group?: Maybe<ItemGroup>;
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ItemAttributeGeneral = {
  __typename?: 'ItemAttributeGeneral';
  fields?: Maybe<Array<CustomField>>;
};

export type ItemAttributeGeneralInput = {
  fields?: InputMaybe<Array<CustomFieldInput>>;
};

export type ItemAttributeSpecific = {
  __typename?: 'ItemAttributeSpecific';
  fields?: Maybe<Array<CustomField>>;
};

export type ItemAttributeSpecificInput = {
  fields?: InputMaybe<Array<CustomFieldInput>>;
};

export type ItemAttributes = {
  __typename?: 'ItemAttributes';
  general: ItemAttributeGeneral;
  specific: ItemAttributeSpecific;
};

export type ItemAttributesInput = {
  general?: InputMaybe<ItemAttributeGeneralInput>;
  specific?: InputMaybe<ItemAttributeSpecificInput>;
};

export type ItemGroup = {
  __typename?: 'ItemGroup';
  attributes?: Maybe<ItemGroupAttributes>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ItemGroupAttributeGeneral = {
  __typename?: 'ItemGroupAttributeGeneral';
  fields?: Maybe<Array<CustomField>>;
};

export type ItemGroupAttributeSpecific = {
  __typename?: 'ItemGroupAttributeSpecific';
  fields?: Maybe<Array<CustomField>>;
};

export type ItemGroupAttributeSpecificInput = {
  fields?: InputMaybe<Array<CustomFieldInput>>;
};

export type ItemGroupAttributes = {
  __typename?: 'ItemGroupAttributes';
  specific: ItemGroupAttributeSpecific;
};

export type ItemGroupAttributesInput = {
  specific?: InputMaybe<ItemGroupAttributeSpecificInput>;
};

export type ItemGroupsInput = {
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
};

export type ItemsInput = {
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createItem: Item;
  createItemGroup?: Maybe<ItemGroup>;
  deleteItem: Scalars['Boolean'];
  deleteItemGroup: Scalars['Boolean'];
};


export type MutationCreateItemArgs = {
  input: CreateItemInput;
};


export type MutationCreateItemGroupArgs = {
  input: CreateItemGroupInput;
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteItemGroupArgs = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  item?: Maybe<Item>;
  itemGroup?: Maybe<ItemGroup>;
  itemGroups: Array<ItemGroup>;
  items: Array<Item>;
};


export type QueryItemArgs = {
  id: Scalars['ID'];
};


export type QueryItemGroupArgs = {
  id: Scalars['ID'];
};


export type QueryItemGroupsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryItemsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type Get_ItemsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type Get_ItemsQuery = { __typename?: 'Query', items: Array<{ __typename?: 'Item', id: string, createdAt: any, updatedAt?: any | null }> };

export type Get_ItemQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Get_ItemQuery = { __typename?: 'Query', item?: { __typename?: 'Item', id: string, createdAt: any, updatedAt?: any | null, group?: { __typename?: 'ItemGroup', id: string, name: string, createdAt: any, updatedAt?: any | null, attributes?: { __typename?: 'ItemGroupAttributes', specific: { __typename?: 'ItemGroupAttributeSpecific', fields?: Array<{ __typename?: 'CustomField', id: string, name: string, type: CustomFieldType, value: string }> | null } } | null } | null, attributes?: { __typename?: 'ItemAttributes', specific: { __typename?: 'ItemAttributeSpecific', fields?: Array<{ __typename?: 'CustomField', id: string, name: string, type: CustomFieldType, value: string }> | null } } | null } | null };

export type Create_ItemMutationVariables = Exact<{
  input: CreateItemInput;
}>;


export type Create_ItemMutation = { __typename?: 'Mutation', createItem: { __typename?: 'Item', id: string, createdAt: any, group?: { __typename?: 'ItemGroup', id: string, name: string, createdAt: any, updatedAt?: any | null, attributes?: { __typename?: 'ItemGroupAttributes', specific: { __typename?: 'ItemGroupAttributeSpecific', fields?: Array<{ __typename?: 'CustomField', id: string, name: string, type: CustomFieldType, value: string }> | null } } | null } | null, attributes?: { __typename?: 'ItemAttributes', specific: { __typename?: 'ItemAttributeSpecific', fields?: Array<{ __typename?: 'CustomField', id: string, name: string, type: CustomFieldType, value: string }> | null } } | null } };


export const Get_ItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEMS"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_ItemsQuery, Get_ItemsQueryVariables>;
export const Get_ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEM"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"specific"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"specific"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_ItemQuery, Get_ItemQueryVariables>;
export const Create_ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CREATE_ITEM"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"specific"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"specific"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<Create_ItemMutation, Create_ItemMutationVariables>;