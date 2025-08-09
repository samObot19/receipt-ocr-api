import { ItemRepository } from '../infrastructure/database/repositories/ItemRepository';

export class GetItemByIdUseCase {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  async execute(id: string) {
    return this.itemRepository.findById(id);
  }
}
