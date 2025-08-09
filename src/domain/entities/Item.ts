class Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  receiptId: string;
  createdAt: Date;

  constructor(params: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    receiptId: string;
    createdAt: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.quantity = params.quantity;
    this.price = params.price;
    this.receiptId = params.receiptId;
    this.createdAt = params.createdAt;
  }
}

export default Item;
