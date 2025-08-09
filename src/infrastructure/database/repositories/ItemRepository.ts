import { PrismaClient } from '@prisma/client';
import Item from '../../../domain/entities/Item';
import type { IItemRepository } from '../../../domain/repositories/IItemRepository';

const prisma = new PrismaClient();

export class ItemRepository implements IItemRepository {
  async create(itemData: Omit<Item, 'id' | 'createdAt'>): Promise<Item> {
    const created = await prisma.item.create({
      data: itemData,
    });
    return new Item({
      id: created.id,
      name: created.name,
      quantity: created.quantity ?? 1,
      price: 0, // Not in DB, default
      receiptId: created.receiptId,
      createdAt: new Date(), // Not in DB, default
    });
  }

  async findById(id: string): Promise<Item | null> {
    const found = await prisma.item.findUnique({ where: { id } });
    return found
      ? new Item({
          id: found.id,
          name: found.name,
          quantity: found.quantity ?? 1,
          price: 0,
          receiptId: found.receiptId,
          createdAt: new Date(),
        })
      : null;
  }

  async update(id: string, item: Partial<Omit<Item, 'id' | 'createdAt'>>): Promise<Item> {
    const updated = await prisma.item.update({
      where: { id },
      data: item,
    });
    return new Item({
      id: updated.id,
      name: updated.name,
      quantity: updated.quantity ?? 1,
      price: 0,
      receiptId: updated.receiptId,
      createdAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.item.delete({ where: { id } });
  }

  async findAllByReceiptId(receiptId: string): Promise<Item[]> {
    const items = await prisma.item.findMany({ where: { receiptId } });
    return items.map((i: any) =>
      new Item({
        id: i.id,
        name: i.name,
        quantity: i.quantity ?? 1,
        price: 0,
        receiptId: i.receiptId,
        createdAt: new Date(),
      })
    );
  }
}
