
import type { IReceiptRepository } from '../repositories/IReceiptRepository';
import type { IStorageProvider } from '../../infrastructure/file-storage/IStorageProvider';
import Receipt from '../entities/Receipt';

export class ReceiptService {
	private receiptRepository: IReceiptRepository;
	private storageProvider: IStorageProvider;

	constructor(receiptRepository: IReceiptRepository, storageProvider: IStorageProvider) {
		this.receiptRepository = receiptRepository;
		this.storageProvider = storageProvider;
	}

	async uploadAndCreateReceipt(params: { filename: string; buffer: Buffer; receiptData: Omit<Receipt, 'id' | 'createdAt' | 'imageUrl'> }): Promise<Receipt> {
		// 1. Store the image using the storage provider
		const imageUrl = await this.storageProvider.saveFile(params.filename, params.buffer);
		// 2. Save the receipt with the imageUrl
		const created = await this.receiptRepository.create({
			...params.receiptData,
			imageUrl,
		});
		return created;
	}
}
