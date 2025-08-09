import { ListItemsByReceiptUseCase } from '../../../usecases/ListItemsByReceiptUseCase';
import { GetItemByIdUseCase } from '../../../usecases/GetItemByIdUseCase';
import { UpdateItemUseCase } from '../../../usecases/UpdateItemUseCase';
import { DeleteItemUseCase } from '../../../usecases/DeleteItemUseCase';
import { ItemRepository } from '../../database/repositories/ItemRepository';

const itemRepository = new ItemRepository();
const listItemsByReceiptUseCase = new ListItemsByReceiptUseCase(itemRepository);
const getItemByIdUseCase = new GetItemByIdUseCase(itemRepository);
const updateItemUseCase = new UpdateItemUseCase(itemRepository);
const deleteItemUseCase = new DeleteItemUseCase(itemRepository);

export const itemResolvers = {
  Query: {
    items: async (_: any, { receiptId }: { receiptId: string }) => listItemsByReceiptUseCase.execute(receiptId),
    item: async (_: any, { id }: { id: string }) => getItemByIdUseCase.execute(id),
  },
  Mutation: {
    updateItem: async (_: any, { id, input }: any) => updateItemUseCase.execute(id, input),
    deleteItem: async (_: any, { id }: { id: string }) => {
      await deleteItemUseCase.execute(id);
      return true;
    },
  },
};
