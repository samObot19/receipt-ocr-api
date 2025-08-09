import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

// Alternative approach - try sending the file directly in variables
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

export const apolloClientAlternative = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})

// Custom upload function that bypasses Apollo for file uploads
export async function uploadReceiptDirect(file: File) {
  const formData = new FormData()
  
  // GraphQL Upload Spec format
  const operations = {
    query: `
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
    `,
    variables: { file: null }
  }
  
  const map = { "0": ["variables.file"] }
  
  formData.append('operations', JSON.stringify(operations))
  formData.append('map', JSON.stringify(map))
  formData.append('0', file, file.name)
  
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const result = await response.json()
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'Upload failed')
  }
  
  return result.data.uploadReceipt
}
