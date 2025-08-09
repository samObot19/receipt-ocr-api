import { GraphQLScalarType } from 'graphql';
import { UploadReceiptUseCase } from '../../../usecases/UploadReceiptUseCase';
import { FilterReceiptsUseCase } from '../../../usecases/FilterReceiptsUseCase';
import { GetReceiptByIdUseCase } from '../../../usecases/GetReceiptByIdUseCase';
import { ListReceiptsUseCase } from '../../../usecases/ListReceiptsUseCase';
import { UpdateReceiptUseCase } from '../../../usecases/UpdateReceiptUseCase';
import { DeleteReceiptUseCase } from '../../../usecases/DeleteReceiptUseCase';
import { ReceiptRepository } from '../../database/repositories/ReceiptRepository';
import { TesseractOcrProvider } from '../../ocr/TesseractOcrProvider';
import { LocalStorageProvider } from '../../file-storage/LocalStorageProvider';

const receiptRepository = new ReceiptRepository();
const ocrProvider = new TesseractOcrProvider();
const storageProvider = new LocalStorageProvider();

const uploadReceiptUseCase = new UploadReceiptUseCase(receiptRepository, ocrProvider, storageProvider);
const filterReceiptsUseCase = new FilterReceiptsUseCase(receiptRepository);
const getReceiptByIdUseCase = new GetReceiptByIdUseCase(receiptRepository);
const listReceiptsUseCase = new ListReceiptsUseCase(receiptRepository);
const updateReceiptUseCase = new UpdateReceiptUseCase(receiptRepository);
const deleteReceiptUseCase = new DeleteReceiptUseCase(receiptRepository);

export const Upload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue: (value) => value,
  parseLiteral(ast) { return ast as any; },
  serialize(value) { return value; },
});

export const receiptResolvers = {
  Upload,
  Query: {
    receipts: async () => listReceiptsUseCase.execute(),
    receipt: async (_: any, { id }: { id: string }) => getReceiptByIdUseCase.execute(id),
    filterReceiptsByDate: async (_: any, { start, end }: { start: string, end: string }) => {
      return filterReceiptsUseCase.execute({ startDate: new Date(start), endDate: new Date(end) });
    },
  },
  Mutation: {
    uploadReceipt: async (_: any, { file }: { file: any }) => {
      const upload = file.promise ? await file.promise : (file.file ? file.file : file);
      const { createReadStream, filename } = upload;
      if (typeof createReadStream !== 'function') {
        throw new Error('createReadStream is not a function. The file upload middleware may not be working.');
      }
      const stream = createReadStream();
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const imagePath = `./uploads/${filename}`;
      const result = await uploadReceiptUseCase.execute({ filename, buffer, imagePath });
      return result.created;
    },
    updateReceipt: async (_: any, { id, input }: any) => updateReceiptUseCase.execute(id, input),
    deleteReceipt: async (_: any, { id }: { id: string }) => {
      await deleteReceiptUseCase.execute(id);
      return true;
    },
  },
  Receipt: {
    items: async (parent: any) => parent.items,
  },
};
