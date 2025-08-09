
import type { IReceiptRepository } from '../domain/repositories/IReceiptRepository';
import Receipt from '../domain/entities/Receipt';

export class ListReceiptsUseCase {
	private receiptRepository: IReceiptRepository;

	constructor(receiptRepository: IReceiptRepository) {
		this.receiptRepository = receiptRepository;
	}

	async execute(): Promise<Receipt[]> {
		return this.receiptRepository.findAll();
	}
}
