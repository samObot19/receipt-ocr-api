import { gql } from '@apollo/client'

export const GET_RECEIPTS = gql`
  query GetReceipts {
    receipts {
      id
      storeName
      purchaseDate
      totalAmount
      imageUrl
      createdAt
      items {
        id
        name
        quantity
        price
      }
    }
  }
`

export const GET_RECEIPT = gql`
  query GetReceipt($id: ID!) {
    receipt(id: $id) {
      id
      storeName
      purchaseDate
      totalAmount
      imageUrl
      createdAt
      items {
        id
        name
        quantity
        price
        receiptId
        createdAt
      }
    }
  }
`

export const GET_ITEMS = gql`
  query GetItems($receiptId: ID!) {
    items(receiptId: $receiptId) {
      id
      name
      quantity
      price
      receiptId
      createdAt
    }
  }
`
