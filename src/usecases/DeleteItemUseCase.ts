import { ItemRepository } from '../infrastructure/database/repositories/ItemRepository';

export class DeleteItemUseCase {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  async execute(id: string) {
    return this.itemRepository.delete(id);
  }
}
