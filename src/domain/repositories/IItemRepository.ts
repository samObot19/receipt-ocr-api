import Item from '../entities/Item';

export interface IItemRepository {
	create(item: Omit<Item, 'id' | 'createdAt'>): Promise<Item>;
	findById(id: string): Promise<Item | null>;
	update(id: string, item: Partial<Omit<Item, 'id' | 'createdAt'>>): Promise<Item>;
	delete(id: string): Promise<void>;
	findAllByReceiptId(receiptId: string): Promise<Item[]>;
}
