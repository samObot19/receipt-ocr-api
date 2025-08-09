export interface Receipt {
  id: string
  storeName: string
  purchaseDate: string
  totalAmount: number
  items: Item[]
  imageUrl: string
  createdAt: string
}

export interface Item {
  id: string
  name: string
  quantity: number | null
  price: number
  createdAt: string
  receiptId: string
}

export interface ReceiptInput {
  storeName: string
  purchaseDate: string
  totalAmount: number
  items: ItemInput[]
  imageUrl: string
}

export interface ItemInput {
  name: string
  quantity?: number | null
  price: number
}
