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
  name: Scalars['String'];
};

export type CreateItemInput = {
  globalFieldValues?: InputMaybe<Array<GlobalFieldValueInput>>;
  groupId?: InputMaybe<Scalars['ID']>;
  localFields?: InputMaybe<Array<LocalFieldInput>>;
  pid: Scalars['String'];
};

export enum FilterOperator {
  Contains = 'contains',
  Equals = 'equals'
}

export type GlobalField = {
  __typename?: 'GlobalField';
  id: Scalars['String'];
  name: Scalars['String'];
  type: GlobalFieldType;
};

export enum GlobalFieldType {
  Float = 'float',
  InspectionStatus = 'inspectionStatus',
  Integer = 'integer',
  String = 'string'
}

export type GlobalFieldValue = {
  __typename?: 'GlobalFieldValue';
  fieldId: Scalars['String'];
  fieldName: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type GlobalFieldValueInput = {
  fieldId: Scalars['String'];
  value?: InputMaybe<Scalars['String']>;
};

export type Item = {
  __typename?: 'Item';
  createdAt: Scalars['DateTime'];
  globalFieldValues?: Maybe<Array<GlobalFieldValue>>;
  group?: Maybe<ItemGroup>;
  id: Scalars['ID'];
  localFields?: Maybe<Array<LocalField>>;
  pid: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ItemGroup = {
  __typename?: 'ItemGroup';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ItemGroupsFilter = {
  operator: FilterOperator;
  subject: ItemGroupsFilterSubject;
  value?: InputMaybe<Scalars['String']>;
};

export enum ItemGroupsFilterSubject {
  Name = 'name'
}

export type ItemsFilter = {
  operator: FilterOperator;
  subject: ItemsFilterSubject;
  value?: InputMaybe<Scalars['String']>;
};

export enum ItemsFilterSubject {
  Group = 'group'
}

export type LocalField = {
  __typename?: 'LocalField';
  id: Scalars['String'];
  name: Scalars['String'];
  type: LocalFieldType;
  value?: Maybe<Scalars['String']>;
};

export type LocalFieldInput = {
  name: Scalars['String'];
  type: LocalFieldType;
  value?: InputMaybe<Scalars['String']>;
};

export enum LocalFieldType {
  Float = 'float',
  Integer = 'integer',
  String = 'string'
}

export type Mutation = {
  __typename?: 'Mutation';
  createItem: Item;
  createItemGroup?: Maybe<ItemGroup>;
  deleteItem: Scalars['Boolean'];
  deleteItemGroup: Scalars['Boolean'];
  updateActiveModules: Scalars['Boolean'];
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


export type MutationUpdateActiveModulesArgs = {
  input: UpdateActiveModulesInput;
};

export type Query = {
  __typename?: 'Query';
  item?: Maybe<Item>;
  itemGroup?: Maybe<ItemGroup>;
  itemGroups: Array<ItemGroup>;
  items: Array<Item>;
  settings: Settings;
};


export type QueryItemArgs = {
  id: Scalars['ID'];
};


export type QueryItemGroupArgs = {
  id: Scalars['ID'];
};


export type QueryItemGroupsArgs = {
  filters?: InputMaybe<Array<ItemGroupsFilter>>;
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryItemsArgs = {
  filters?: InputMaybe<Array<ItemsFilter>>;
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
};

export type Settings = {
  __typename?: 'Settings';
  globalFields?: Maybe<Array<GlobalField>>;
  moduleInspectionsActive: Scalars['Boolean'];
};

export type UpdateActiveModulesInput = {
  moduleInspectionsActive?: InputMaybe<Scalars['Boolean']>;
};

export type Get_ItemsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
  filters?: InputMaybe<Array<ItemsFilter> | ItemsFilter>;
}>;


export type Get_ItemsQuery = { __typename?: 'Query', items: Array<{ __typename?: 'Item', id: string, pid: string, createdAt: any, updatedAt?: any | null, group?: { __typename?: 'ItemGroup', id: string, name: string } | null, globalFieldValues?: Array<{ __typename?: 'GlobalFieldValue', fieldId: string, fieldName: string, value?: string | null }> | null }> };

export type Get_ItemQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Get_ItemQuery = { __typename?: 'Query', item?: { __typename?: 'Item', id: string, pid: string, createdAt: any, updatedAt?: any | null, group?: { __typename?: 'ItemGroup', id: string, name: string, createdAt: any, updatedAt?: any | null } | null, localFields?: Array<{ __typename?: 'LocalField', id: string, name: string, type: LocalFieldType, value?: string | null }> | null, globalFieldValues?: Array<{ __typename?: 'GlobalFieldValue', fieldId: string, fieldName: string, value?: string | null }> | null } | null };

export type Create_ItemMutationVariables = Exact<{
  input: CreateItemInput;
}>;


export type Create_ItemMutation = { __typename?: 'Mutation', createItem: { __typename?: 'Item', id: string } };

export type Delete_ItemMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Delete_ItemMutation = { __typename?: 'Mutation', deleteItem: boolean };

export type Get_Item_GroupQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Get_Item_GroupQuery = { __typename?: 'Query', itemGroup?: { __typename?: 'ItemGroup', id: string, name: string, createdAt: any, updatedAt?: any | null } | null };

export type Get_Item_GroupsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
  filters?: InputMaybe<Array<ItemGroupsFilter> | ItemGroupsFilter>;
}>;


export type Get_Item_GroupsQuery = { __typename?: 'Query', itemGroups: Array<{ __typename?: 'ItemGroup', id: string, name: string, createdAt: any, updatedAt?: any | null }> };

export type Create_Item_GroupMutationVariables = Exact<{
  input: CreateItemGroupInput;
}>;


export type Create_Item_GroupMutation = { __typename?: 'Mutation', createItemGroup?: { __typename?: 'ItemGroup', id: string } | null };

export type Get_SettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type Get_SettingsQuery = { __typename?: 'Query', settings: { __typename?: 'Settings', moduleInspectionsActive: boolean, globalFields?: Array<{ __typename?: 'GlobalField', id: string, name: string, type: GlobalFieldType }> | null } };


export const Get_ItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEMS"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemsFilter"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"globalFieldValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldId"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_ItemsQuery, Get_ItemsQueryVariables>;
export const Get_ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEM"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"localFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"globalFieldValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldId"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_ItemQuery, Get_ItemQueryVariables>;
export const Create_ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CREATE_ITEM"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Create_ItemMutation, Create_ItemMutationVariables>;
export const Delete_ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DELETE_ITEM"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<Delete_ItemMutation, Delete_ItemMutationVariables>;
export const Get_Item_GroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEM_GROUP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_Item_GroupQuery, Get_Item_GroupQueryVariables>;
export const Get_Item_GroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEM_GROUPS"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemGroupsFilter"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_Item_GroupsQuery, Get_Item_GroupsQueryVariables>;
export const Create_Item_GroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CREATE_ITEM_GROUP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateItemGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createItemGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Create_Item_GroupMutation, Create_Item_GroupMutationVariables>;
export const Get_SettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_SETTINGS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moduleInspectionsActive"}},{"kind":"Field","name":{"kind":"Name","value":"globalFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<Get_SettingsQuery, Get_SettingsQueryVariables>;