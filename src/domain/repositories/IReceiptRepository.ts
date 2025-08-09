import Receipt from '../entities/Receipt';

export interface IReceiptRepository {
  create(receipt: Omit<Receipt, 'id' | 'createdAt'>): Promise<Receipt>;
  findById(id: string): Promise<Receipt | null>;
  update(id: string, receipt: Partial<Omit<Receipt, 'id' | 'createdAt'>>): Promise<Receipt>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Receipt[]>;
  filterByDateRange(start: Date, end: Date): Promise<Receipt[]>;
}
