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
  floatCustomFields?: InputMaybe<Array<InputMaybe<FloatCustomFieldInput>>>;
  groupId?: InputMaybe<Scalars['ID']>;
  inspectionStatusCustomFields?: InputMaybe<Array<InputMaybe<InspectionStatusCustomFieldInput>>>;
  integerCustomFields?: InputMaybe<Array<InputMaybe<IntegerCustomFieldInput>>>;
  pid: Scalars['String'];
  textCustomFields?: InputMaybe<Array<InputMaybe<TextCustomFieldInput>>>;
};

export type CustomField = FloatCustomField | InspectionStatusCustomField | IntegerCustomField | TextCustomField;

export type CustomFieldBase = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export enum FilterOperator {
  Contains = 'contains',
  Equals = 'equals'
}

export type FloatCustomField = CustomFieldBase & {
  __typename?: 'FloatCustomField';
  id: Scalars['String'];
  name: Scalars['String'];
  onEmptyValue?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

export type FloatCustomFieldInput = {
  name: Scalars['String'];
  onEmptyValue?: InputMaybe<Scalars['Float']>;
  value?: InputMaybe<Scalars['Float']>;
};

export type InspectionStatus = {
  __typename?: 'InspectionStatus';
  id: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['String'];
};

export type InspectionStatusCustomField = CustomFieldBase & {
  __typename?: 'InspectionStatusCustomField';
  id: Scalars['String'];
  name: Scalars['String'];
  onEmptyValue?: Maybe<InspectionStatus>;
  value?: Maybe<InspectionStatus>;
};

export type InspectionStatusCustomFieldInput = {
  name: Scalars['String'];
  onEmptyValue?: InputMaybe<InspectionStatusInput>;
  value?: InputMaybe<InspectionStatusInput>;
};

export type InspectionStatusInput = {
  name?: InputMaybe<Scalars['String']>;
  value: Scalars['String'];
};

export type IntegerCustomField = CustomFieldBase & {
  __typename?: 'IntegerCustomField';
  id: Scalars['String'];
  name: Scalars['String'];
  onEmptyValue?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

export type IntegerCustomFieldInput = {
  name: Scalars['String'];
  onEmptyValue?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['Int']>;
};

export type Item = {
  __typename?: 'Item';
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Array<Maybe<CustomField>>>;
  group?: Maybe<ItemGroup>;
  id: Scalars['ID'];
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
  moduleInspectionsActive: Scalars['Boolean'];
};

export type TextCustomField = CustomFieldBase & {
  __typename?: 'TextCustomField';
  id: Scalars['String'];
  name: Scalars['String'];
  onEmptyValue?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type TextCustomFieldInput = {
  name: Scalars['String'];
  onEmptyValue?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type UpdateActiveModulesInput = {
  moduleInspectionsActive?: InputMaybe<Scalars['Boolean']>;
};

export type Get_ItemsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
  filters?: InputMaybe<Array<ItemsFilter> | ItemsFilter>;
}>;


export type Get_ItemsQuery = { __typename?: 'Query', items: Array<{ __typename?: 'Item', id: string, pid: string, createdAt: any, updatedAt?: any | null, group?: { __typename?: 'ItemGroup', id: string, name: string } | null, customFields?: Array<{ __typename?: 'FloatCustomField' } | { __typename?: 'InspectionStatusCustomField' } | { __typename?: 'IntegerCustomField', id: string, name: string, onEmptyIntegerValue?: number | null, integerValue?: number | null } | { __typename?: 'TextCustomField', id: string, name: string, onEmptyStringValue?: string | null, stringValue?: string | null } | null> | null }> };

export type Get_ItemQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Get_ItemQuery = { __typename?: 'Query', item?: { __typename?: 'Item', id: string, pid: string, createdAt: any, updatedAt?: any | null, group?: { __typename?: 'ItemGroup', id: string, name: string, createdAt: any, updatedAt?: any | null } | null, customFields?: Array<{ __typename?: 'FloatCustomField' } | { __typename?: 'InspectionStatusCustomField' } | { __typename?: 'IntegerCustomField', id: string, name: string, onEmptyIntegerValue?: number | null, integerValue?: number | null } | { __typename?: 'TextCustomField', id: string, name: string, onEmptyStringValue?: string | null, stringValue?: string | null } | null> | null } | null };

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


export type Get_SettingsQuery = { __typename?: 'Query', settings: { __typename?: 'Settings', moduleInspectionsActive: boolean } };


export const Get_ItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEMS"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemsFilter"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextCustomField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"onEmptyStringValue"},"name":{"kind":"Name","value":"onEmptyValue"}},{"kind":"Field","alias":{"kind":"Name","value":"stringValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IntegerCustomField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"onEmptyIntegerValue"},"name":{"kind":"Name","value":"onEmptyValue"}},{"kind":"Field","alias":{"kind":"Name","value":"integerValue"},"name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_ItemsQuery, Get_ItemsQueryVariables>;
export const Get_ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEM"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextCustomField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"onEmptyStringValue"},"name":{"kind":"Name","value":"onEmptyValue"}},{"kind":"Field","alias":{"kind":"Name","value":"stringValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IntegerCustomField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"onEmptyIntegerValue"},"name":{"kind":"Name","value":"onEmptyValue"}},{"kind":"Field","alias":{"kind":"Name","value":"integerValue"},"name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_ItemQuery, Get_ItemQueryVariables>;
export const Create_ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CREATE_ITEM"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Create_ItemMutation, Create_ItemMutationVariables>;
export const Delete_ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DELETE_ITEM"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<Delete_ItemMutation, Delete_ItemMutationVariables>;
export const Get_Item_GroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEM_GROUP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_Item_GroupQuery, Get_Item_GroupQueryVariables>;
export const Get_Item_GroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_ITEM_GROUPS"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemGroupsFilter"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<Get_Item_GroupsQuery, Get_Item_GroupsQueryVariables>;
export const Create_Item_GroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CREATE_ITEM_GROUP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateItemGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createItemGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Create_Item_GroupMutation, Create_Item_GroupMutationVariables>;
export const Get_SettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_SETTINGS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moduleInspectionsActive"}}]}}]}}]} as unknown as DocumentNode<Get_SettingsQuery, Get_SettingsQueryVariables>;