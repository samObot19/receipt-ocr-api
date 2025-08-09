

import type { IReceiptRepository } from '../domain/repositories/IReceiptRepository';
import type { IOcrProvider } from '../infrastructure/ocr/IOcrProvider';
import type { IStorageProvider } from '../infrastructure/file-storage/IStorageProvider';
import Receipt from '../domain/entities/Receipt';
import { OcrService } from '../domain/services/OcrService';
import { isImageFileExtension } from '../utils/fileValidator';
import { toIsoString } from '../utils/dateFormatter';

export class UploadReceiptUseCase {
	private receiptRepository: IReceiptRepository;
	private ocrService: OcrService;
	private storageProvider: IStorageProvider;

	constructor(
		receiptRepository: IReceiptRepository,
		ocrProvider: IOcrProvider,
		storageProvider: IStorageProvider
	) {
		this.receiptRepository = receiptRepository;
		this.ocrService = new OcrService(ocrProvider);
		this.storageProvider = storageProvider;
	}

	async execute(params: { filename: string; buffer: Buffer; imagePath: string }): Promise<{ created: Receipt; extracted: Receipt }> {
		// File format validation
		if (!isImageFileExtension(params.filename)) {
			throw new Error('Invalid file format. Only image files are allowed.');
		}

		// Store the image and get the imageUrl
		const imageUrl = await this.storageProvider.saveFile(params.filename, params.buffer);

		// OCR and extraction
		const receiptData = await this.ocrService.extractReceiptData(params.imagePath);
		receiptData.imageUrl = imageUrl;

		// Date format validation (ISO)
		if (isNaN(receiptData.purchaseDate.getTime())) {
			throw new Error('Invalid purchase date extracted from receipt.');
		}
		// Optionally, format the date to ISO string
		receiptData.purchaseDate = new Date(toIsoString(receiptData.purchaseDate));

		// Save to repository (DB)
		const created = await this.receiptRepository.create({
			...receiptData,
			id: undefined,
			createdAt: undefined,
		} as Omit<Receipt, 'id' | 'createdAt'>);
		return { created, extracted: receiptData };
	}
}
