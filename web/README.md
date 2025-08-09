# Receipt OCR Frontend

A modern React frontend application built with TypeScript and Vite that connects to a GraphQL API for receipt OCR processing.

## Features

- **Receipt Upload**: Drag-and-drop interface for uploading receipt images (PNG, JPG, PDF)
- **OCR Processing**: Automatic text extraction from receipt images
- **Receipt Management**: View, edit, and delete receipts and their items
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Real-time Updates**: Apollo Client provides optimistic updates and caching
- **Progress Tracking**: Visual progress indicators during upload and processing
- **Toast Notifications**: User-friendly feedback for all operations

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **GraphQL Client**: Apollo Client
- **Routing**: React Router v6
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- GraphQL API running on `http://localhost:4000/graphql`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

## GraphQL Schema

The frontend expects the following GraphQL schema:

### Types

```graphql
type Receipt {
  id: ID!
  storeName: String!
  purchaseDate: String!
  totalAmount: Float!
  items: [Item!]!
  imageUrl: String!
  createdAt: String!
}

type Item {
  id: ID!
  name: String!
  quantity: Int
  price: Float!
  createdAt: String!
  receiptId: ID!
}
```

### Queries

- `receipts: [Receipt!]!` - Get all receipts
- `receipt(id: ID!): Receipt` - Get receipt by ID
- `items(receiptId: ID!): [Item!]!` - Get items for a receipt

### Mutations

- `uploadReceipt(file: Upload!): Receipt!` - Upload and process receipt
- `updateReceipt(id: ID!, input: ReceiptInput!): Receipt!` - Update receipt
- `deleteReceipt(id: ID!): Boolean!` - Delete receipt
- `updateItem(id: ID!, input: ItemInput!): Item!` - Update item
- `deleteItem(id: ID!): Boolean!` - Delete item

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── UploadPage.tsx  # Receipt upload interface
│   ├── ReceiptsPage.tsx # Receipt listing
│   └── ReceiptDetailPage.tsx # Receipt details and editing
├── graphql/            # GraphQL operations
│   ├── queries.ts      # GraphQL queries
│   └── mutations.ts    # GraphQL mutations
├── lib/                # Configuration and utilities
│   └── apollo-client.ts # Apollo Client configuration
├── types/              # TypeScript type definitions
│   └── graphql.ts      # GraphQL schema types
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Key Features Implementation

### File Upload with Progress

The upload page uses React Dropzone for drag-and-drop functionality and displays a progress bar during OCR processing. The progress is simulated while waiting for the GraphQL mutation to complete.

### Responsive Design

The application uses Tailwind CSS with responsive utilities to ensure optimal viewing on all device sizes. Grid layouts automatically adjust from single column on mobile to multi-column on larger screens.

### Apollo Client Integration

- Automatic cache updates after mutations
- Optimistic UI updates for better user experience
- Error handling with toast notifications
- Query refetching for data consistency

### Toast Notifications

React Hot Toast provides user feedback for all operations:
- Success messages for completed actions
- Error messages with detailed information
- Custom styling to match the application theme

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

The project uses ESLint with TypeScript and React-specific rules. Tailwind CSS classes are used for all styling with custom utility classes defined in `index.css`.

## Environment Variables

The GraphQL API endpoint is currently hardcoded to `http://localhost:4000/graphql`. In a production environment, this should be configurable via environment variables.

## Browser Support

This application supports all modern browsers that support ES2020 and React 18.
