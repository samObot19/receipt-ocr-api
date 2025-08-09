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
      createdAt: typeof created.createdAt === 'string' ? new Date(created.createdAt) : created.createdAt,
      items: (created.items || []).map((i: any) =>
        new Item({
          id: i.id,
          name: i.name,
          quantity: i.quantity ?? 1,
          price: i.price ?? 0,
          receiptId: i.receiptId,
          createdAt: typeof i.createdAt === 'string' ? new Date(i.createdAt) : (i.createdAt ?? new Date()),
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
          createdAt: typeof found.createdAt === 'string' ? new Date(found.createdAt) : found.createdAt,
          items: (found.items || []).map((i: any) =>
            new Item({
              id: i.id,
              name: i.name,
              quantity: i.quantity ?? 1,
              price: i.price ?? 0,
              receiptId: i.receiptId,
              createdAt: typeof i.createdAt === 'string' ? new Date(i.createdAt) : (i.createdAt ?? new Date()),
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
      createdAt: typeof updated.createdAt === 'string' ? new Date(updated.createdAt) : updated.createdAt,
      items: (updated.items || []).map((i: any) =>
        new Item({
          id: i.id,
          name: i.name,
          quantity: i.quantity ?? 1,
          price: 0,
          receiptId: i.receiptId,
          createdAt: typeof i.createdAt === 'string' ? new Date(i.createdAt) : (i.createdAt ?? new Date()),
        })
      ),
    });
  }
  async delete(id: string): Promise<void> {
    try {
      // First delete all items related to this receipt
      await prisma.item.deleteMany({ where: { receiptId: id } });
      // Then delete the receipt
      await prisma.receipt.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
        // Prisma error code for foreign key constraint violation
        console.error('Failed to delete receipt due to foreign key constraint:', error);
        throw new Error('Cannot delete receipt: related items or other dependencies exist.');
      }
      // Rethrow other errors
      throw error;
    }
  }

  async findAll(): Promise<Receipt[]> {
    const receipts = await prisma.receipt.findMany({ include: { items: true } });
    return receipts.map((r: any) =>
      new Receipt({
        ...r,
        createdAt: typeof r.createdAt === 'string' ? new Date(r.createdAt) : r.createdAt,
        items: (r.items || []).map((i: any) =>
          new Item({
            id: i.id,
            name: i.name,
            quantity: i.quantity ?? 1,
            price: i.price ?? 0,
            receiptId: i.receiptId,
            createdAt: typeof i.createdAt === 'string' ? new Date(i.createdAt) : (i.createdAt ?? new Date()),
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
        createdAt: typeof r.createdAt === 'string' ? new Date(r.createdAt) : r.createdAt,
        items: (r.items || []).map((i: any) =>
          new Item({
            id: i.id,
            name: i.name,
            quantity: i.quantity ?? 1,
            price: i.price ?? 0,
            receiptId: i.receiptId,
            createdAt: typeof i.createdAt === 'string' ? new Date(i.createdAt) : (i.createdAt ?? new Date()),
          })
        ),
      })
    );
  }
}
