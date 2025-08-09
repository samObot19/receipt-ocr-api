import { PrismaClient } from '@prisma/client';
import Receipt from '../../../domain/entities/Receipt';
import Item from '../../../domain/entities/Item';
import type { IReceiptRepository } from '../../../domain/repositories/IReceiptRepository';

const prisma = new PrismaClient();

export class ReceiptRepository implements IReceiptRepository {
  async create(receiptData: Omit<Receipt, 'id' | 'createdAt'>): Promise<Receipt> {
    const itemsForDb = (receiptData.items || []).map((i: any) => ({
      name: i.name,
      quantity: i.quantity ?? 1,
      price: i.price ?? 0,
      createdAt: i.createdAt ?? new Date(),
    }));
    const created = await prisma.receipt.create({
      data: {
        ...receiptData,
        items: { create: itemsForDb },
      },
      include: { items: true },
    });
    return new Receipt({
      ...created,
      items: (created.items || []).map((i: any) =>
        new Item({
          id: i.id,
          name: i.name,
          quantity: i.quantity ?? 1,
          price: i.price ?? 0,
          receiptId: i.receiptId,
          createdAt: i.createdAt ?? new Date(),
        })
      ),
    });
  }

  async findById(id: string): Promise<Receipt | null> {
    const found = await prisma.receipt.findUnique({
      where: { id },
      include: { items: true },
    });
    return found
      ? new Receipt({
          ...found,
          items: (found.items || []).map((i: any) =>
            new Item({
              id: i.id,
              name: i.name,
              quantity: i.quantity ?? 1,
              price: i.price ?? 0,
              receiptId: i.receiptId,
              createdAt: i.createdAt ?? new Date(),
            })
          ),
        })
      : null;
  }

  async update(id: string, receipt: Partial<Omit<Receipt, 'id' | 'createdAt'>>): Promise<Receipt> {
    const { items, ...receiptData } = receipt;
    let dataToUpdate = { ...receiptData };
    if (dataToUpdate.purchaseDate) {
      if (!(dataToUpdate.purchaseDate instanceof Date)) {
        const date = new Date(dataToUpdate.purchaseDate as string);
        if (!isNaN(date.getTime())) {
          dataToUpdate.purchaseDate = date;
        } else {
          delete dataToUpdate.purchaseDate;
        }
      }
    }
    const updated = await prisma.receipt.update({
      where: { id },
      data: dataToUpdate,
      include: { items: true },
    });
    return new Receipt({
      ...updated,
      items: (updated.items || []).map((i: any) =>
        new Item({
          id: i.id,
          name: i.name,
          quantity: i.quantity ?? 1,
          price: 0,
          receiptId: i.receiptId,
          createdAt: new Date(),
        })
      ),
    });
  }
  async delete(id: string): Promise<void> {
    await prisma.receipt.delete({ where: { id } });
  }

  async findAll(): Promise<Receipt[]> {
    const receipts = await prisma.receipt.findMany({ include: { items: true } });
    return receipts.map((r: any) =>
      new Receipt({
        ...r,
        items: (r.items || []).map((i: any) =>
          new Item({
            id: i.id,
            name: i.name,
            quantity: i.quantity ?? 1,
            price: i.price ?? 0,
            receiptId: i.receiptId,
            createdAt: i.createdAt ?? new Date(),
          })
        ),
      })
    );
  }

  async filterByDateRange(start: Date, end: Date): Promise<Receipt[]> {
    const receipts = await prisma.receipt.findMany({
      where: {
        purchaseDate: {
          gte: start,
          lte: end,
        },
      },
      include: { items: true },
    });
    return receipts.map((r: any) =>
      new Receipt({
        ...r,
        items: (r.items || []).map((i: any) =>
          new Item({
            id: i.id,
            name: i.name,
            quantity: i.quantity ?? 1,
            price: i.price ?? 0,
            receiptId: i.receiptId,
            createdAt: i.createdAt ?? new Date(),
          })
        ),
      })
    );
  }
}
