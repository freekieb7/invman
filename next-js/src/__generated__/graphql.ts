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
};

export type Mutation = {
  __typename?: 'Mutation';
  createService: Service;
  deleteService: Scalars['Boolean'];
  updateService: Service;
};


export type MutationCreateServiceArgs = {
  input: NewService;
};


export type MutationDeleteServiceArgs = {
  uuid: Scalars['String'];
};


export type MutationUpdateServiceArgs = {
  input: UpdateService;
};

export type NewService = {
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  service?: Maybe<Service>;
  services: Array<Service>;
};


export type QueryServiceArgs = {
  uuid: Scalars['String'];
};


export type QueryServicesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  maxResults?: InputMaybe<Scalars['Int']>;
};

export type Service = {
  __typename?: 'Service';
  createdAt: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
  uuid: Scalars['String'];
};

export type UpdateService = {
  name: Scalars['String'];
  uuid: Scalars['String'];
};

export type CreateServiceMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateServiceMutation = { __typename?: 'Mutation', createService: { __typename?: 'Service', uuid: string, name: string, createdAt: string, updatedAt: string } };

export type GetServicesQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']>;
  maxResults?: InputMaybe<Scalars['Int']>;
}>;


export type GetServicesQuery = { __typename?: 'Query', services: Array<{ __typename?: 'Service', uuid: string, name: string, createdAt: string, updatedAt: string }> };

export type DeleteServiceMutationVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type DeleteServiceMutation = { __typename?: 'Mutation', deleteService: boolean };


export const CreateServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createService"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateServiceMutation, CreateServiceMutationVariables>;
export const GetServicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxResults"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"services"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxResults"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxResults"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetServicesQuery, GetServicesQueryVariables>;
export const DeleteServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteService"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}]}]}}]} as unknown as DocumentNode<DeleteServiceMutation, DeleteServiceMutationVariables>;