import { ItemRepository } from '../infrastructure/database/repositories/ItemRepository';

export class UpdateItemUseCase {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  async execute(id: string, input: any) {
    return this.itemRepository.update(id, input);
  }
}
