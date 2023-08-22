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

export type CreateServiceInput = {
  name: Scalars['String'];
};

export type DateFilter = {
  operator: DateFilterOperator;
  value?: InputMaybe<Scalars['Date']>;
};

export enum DateFilterOperator {
  Is = 'is',
  IsAfter = 'isAfter',
  IsAfterOrOn = 'isAfterOrOn',
  IsBefore = 'isBefore',
  IsBeforeOrOn = 'isBeforeOrOn',
  IsBetween = 'isBetween',
  IsBetweenOrOn = 'isBetweenOrOn',
  IsEmpty = 'isEmpty',
  IsNot = 'isNot',
  IsNotEmpty = 'isNotEmpty'
}

export type DateTimeFilter = {
  operator: DateTimeFilterOperator;
  value?: InputMaybe<Scalars['DateTime']>;
};

export enum DateTimeFilterOperator {
  IsAfterOrOn = 'isAfterOrOn',
  IsBeforeOrOn = 'isBeforeOrOn',
  IsBetweenOrOn = 'isBetweenOrOn',
  IsEmpty = 'isEmpty',
  IsNotEmpty = 'isNotEmpty'
}

export type FloatNumberFilter = {
  operator: NumberFilterOperator;
  value?: InputMaybe<Scalars['Float']>;
};

export type IntegerNumberFilter = {
  operator: NumberFilterOperator;
  value?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createService?: Maybe<Service>;
  deleteService: Scalars['Boolean'];
  updateService?: Maybe<Service>;
};


export type MutationCreateServiceArgs = {
  input: CreateServiceInput;
};


export type MutationDeleteServiceArgs = {
  id: Scalars['String'];
};


export type MutationUpdateServiceArgs = {
  input: UpdateServiceInput;
};

export enum NumberFilterOperator {
  BiggerOrEqualTo = 'biggerOrEqualTo',
  BiggerThen = 'biggerThen',
  Equals = 'equals',
  IsEmpty = 'isEmpty',
  IsNotEmpty = 'isNotEmpty',
  NotEquals = 'notEquals',
  SmallerOrEqualTo = 'smallerOrEqualTo',
  SmallerThen = 'smallerThen'
}

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Query = {
  __typename?: 'Query';
  service?: Maybe<Service>;
  services?: Maybe<Array<Service>>;
};


export type QueryServiceArgs = {
  id: Scalars['String'];
};


export type QueryServicesArgs = {
  input: ServicesInput;
};

export type Service = {
  __typename?: 'Service';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ServicesInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<TextFilter>;
  limit: Scalars['Int'];
  name?: InputMaybe<TextFilter>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ServicesOrder>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type ServicesOrder = {
  order: OrderDirection;
  subject: ServicesOrderSubject;
};

export enum ServicesOrderSubject {
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  UpdatedAt = 'updatedAt'
}

export type TextFilter = {
  operator: TextFilterOperator;
  value?: InputMaybe<Scalars['String']>;
};

export enum TextFilterOperator {
  Contains = 'contains',
  EndsWith = 'endsWith',
  Equals = 'equals',
  IsEmpty = 'isEmpty',
  IsNotEmpty = 'isNotEmpty',
  StartsWith = 'startsWith'
}

export type UpdateServiceInput = {
  name: Scalars['String'];
  uuid: Scalars['String'];
};

export type ServicesQueryVariables = Exact<{
  input: ServicesInput;
}>;


export type ServicesQuery = { __typename?: 'Query', services?: Array<{ __typename?: 'Service', id: string, name: string, createdAt: any, updatedAt: any }> | null };

export type CreateServiceMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateServiceMutation = { __typename?: 'Mutation', createService?: { __typename?: 'Service', id: string, name: string, createdAt: any, updatedAt: any } | null };

export type DeleteServiceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteServiceMutation = { __typename?: 'Mutation', deleteService: boolean };


export const ServicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Services"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ServicesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"services"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ServicesQuery, ServicesQueryVariables>;
export const CreateServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createService"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateServiceMutation, CreateServiceMutationVariables>;
export const DeleteServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteService"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteServiceMutation, DeleteServiceMutationVariables>;