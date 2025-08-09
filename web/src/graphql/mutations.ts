import { gql } from '@apollo/client'

export const UPLOAD_RECEIPT = gql`
  mutation UploadReceipt($file: Upload!) {
    uploadReceipt(file: $file) {
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

export const UPDATE_RECEIPT = gql`
  mutation UpdateReceipt($id: ID!, $input: ReceiptInput!) {
    updateReceipt(id: $id, input: $input) {
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

export const DELETE_RECEIPT = gql`
  mutation DeleteReceipt($id: ID!) {
    deleteReceipt(id: $id)
  }
`

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $input: ItemInput!) {
    updateItem(id: $id, input: $input) {
      id
      name
      quantity
      price
      receiptId
      createdAt
    }
  }
`

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`
