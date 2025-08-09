

import { promises as fs } from 'fs';
import * as path from 'path';
import type { IStorageProvider } from './IStorageProvider';

export class LocalStorageProvider implements IStorageProvider {
	private storageDir: string;

	constructor(storageDir: string = path.resolve(__dirname, '../../../uploads')) {
		this.storageDir = storageDir;
	}

	async saveFile(filename: string, buffer: Buffer): Promise<string> {
		await fs.mkdir(this.storageDir, { recursive: true });
		const filePath = path.join(this.storageDir, filename);
		await fs.writeFile(filePath, buffer);
		return filePath;
	}

	async getFile(filename: string): Promise<Buffer> {
		const filePath = path.join(this.storageDir, filename);
		return fs.readFile(filePath);
	}

	async deleteFile(filename: string): Promise<void> {
		const filePath = path.join(this.storageDir, filename);
		await fs.unlink(filePath);
	}
}
