import type { IReceiptRepository } from '../domain/repositories/IReceiptRepository';

export class DeleteReceiptUseCase {
  private receiptRepository: IReceiptRepository;

  constructor(receiptRepository: IReceiptRepository) {
    this.receiptRepository = receiptRepository;
  }

  async execute(id: string): Promise<void> {
    await this.receiptRepository.delete(id);
  }
}
