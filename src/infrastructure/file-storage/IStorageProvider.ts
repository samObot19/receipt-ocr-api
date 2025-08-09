export interface IStorageProvider {
  saveFile(filename: string, buffer: Buffer): Promise<string>;
  getFile(filename: string): Promise<Buffer>;
  deleteFile(filename: string): Promise<void>;
}
