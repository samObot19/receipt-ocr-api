import Item from './Item';

class Receipt {
  id: string;
  storeName: string;
  purchaseDate: Date;
  totalAmount: number;
  items: Item[];
  imageUrl: string;
  createdAt: Date;

  constructor(params: {
    id: string;
    storeName: string;
    purchaseDate: Date;
    totalAmount: number;
    items: Item[];
    imageUrl: string;
    createdAt: Date;
  }) {
    this.id = params.id;
    this.storeName = params.storeName;
    this.purchaseDate = params.purchaseDate;
    this.totalAmount = params.totalAmount;
    this.items = params.items;
    this.imageUrl = params.imageUrl;
    this.createdAt = params.createdAt;
  }
}

export default Receipt;
