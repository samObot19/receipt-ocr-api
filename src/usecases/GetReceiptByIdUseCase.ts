
import type { IReceiptRepository } from '../domain/repositories/IReceiptRepository';
import Receipt from '../domain/entities/Receipt';

export class GetReceiptByIdUseCase {
	private receiptRepository: IReceiptRepository;

	constructor(receiptRepository: IReceiptRepository) {
		this.receiptRepository = receiptRepository;
	}

	async execute(id: string): Promise<Receipt | null> {
		return this.receiptRepository.findById(id);
	}
}
