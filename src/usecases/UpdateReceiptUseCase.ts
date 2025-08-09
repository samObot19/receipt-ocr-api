import type { IReceiptRepository } from '../domain/repositories/IReceiptRepository';
import Receipt from '../domain/entities/Receipt';

export class UpdateReceiptUseCase {
  private receiptRepository: IReceiptRepository;

  constructor(receiptRepository: IReceiptRepository) {
    this.receiptRepository = receiptRepository;
  }

  async execute(id: string, data: Partial<Omit<Receipt, 'id' | 'createdAt'>>): Promise<Receipt> {
    return this.receiptRepository.update(id, data);
  }
}
