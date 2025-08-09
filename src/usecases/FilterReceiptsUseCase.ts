
import type { IReceiptRepository } from '../domain/repositories/IReceiptRepository';
import Receipt from '../domain/entities/Receipt';

export class FilterReceiptsUseCase {
	private receiptRepository: IReceiptRepository;

	constructor(receiptRepository: IReceiptRepository) {
		this.receiptRepository = receiptRepository;
	}

	async execute(params: { startDate: Date; endDate: Date }): Promise<Receipt[]> {
		const { startDate, endDate } = params;
		return this.receiptRepository.filterByDateRange(startDate, endDate);
	}
}
