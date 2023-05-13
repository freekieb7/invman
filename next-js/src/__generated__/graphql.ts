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
  id: Scalars['Int'];
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
  id: Scalars['Int'];
};


export type QueryServicesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  maxResults?: InputMaybe<Scalars['Int']>;
};

export type Service = {
  __typename?: 'Service';
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UpdateService = {
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type GetServicesQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']>;
  maxResults?: InputMaybe<Scalars['Int']>;
}>;


export type GetServicesQuery = { __typename?: 'Query', services: Array<{ __typename?: 'Service', id: number, name: string, createdAt: string, updatedAt: string }> };


export const GetServicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxResults"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"services"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxResults"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxResults"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetServicesQuery, GetServicesQueryVariables>;