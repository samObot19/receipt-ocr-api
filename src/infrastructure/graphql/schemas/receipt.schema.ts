import { gql } from 'apollo-server';

export const receiptTypeDefs = gql`
  type Receipt {
    id: ID!
    storeName: String!
    purchaseDate: String!
    totalAmount: Float!
    items: [Item!]!
    imageUrl: String!
    createdAt: String!
  }

  input ReceiptInput {
    storeName: String!
    purchaseDate: String!
    totalAmount: Float!
    items: [ItemInput!]!
    imageUrl: String!
  }

  type Query {
    receipts: [Receipt!]!
    receipt(id: ID!): Receipt
    filterReceiptsByDate(start: String!, end: String!): [Receipt!]!
  }

  type Mutation {
    uploadReceipt(file: Upload!): Receipt!
    updateReceipt(id: ID!, input: ReceiptInput!): Receipt!
    deleteReceipt(id: ID!): Boolean!
  }
`;
