import { gql } from 'apollo-server';

export const itemTypeDefs = gql`
  type Item {
    id: ID!
    name: String!
    quantity: Int
    price: Float!
    createdAt: String!
    receiptId: ID!
  }

  input ItemInput {
    name: String!
    quantity: Int
    price: Float!
  }

  type Query {
    items(receiptId: ID!): [Item!]!
    item(id: ID!): Item
  }

  type Mutation {
    updateItem(id: ID!, input: ItemInput!): Item!
    deleteItem(id: ID!): Boolean!
  }
`;
