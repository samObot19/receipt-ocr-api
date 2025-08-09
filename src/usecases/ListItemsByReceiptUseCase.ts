import { ItemRepository } from '../infrastructure/database/repositories/ItemRepository';

export class ListItemsByReceiptUseCase {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  async execute(receiptId: string) {
    return this.itemRepository.findAllByReceiptId(receiptId);
  }
}
