import { prisma } from "../database/prisma";
import { monthRange } from "./month-range";

export type TransactionInput = {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: Date;
  categoryId: string;
};

export async function createTransaction(userId: string, input: TransactionInput) {
  await validate(userId, input);

  return prisma.transaction.create({ data: { ...input, userId } });
}

export async function updateTransaction(userId: string, id: string, input: TransactionInput) {
  await findOwnTransaction(userId, id);
  await validate(userId, input);

  return prisma.transaction.update({ where: { id }, data: input });
}

export async function deleteTransaction(userId: string, id: string) {
  await findOwnTransaction(userId, id);

  await prisma.transaction.delete({ where: { id } });
}

export type TransactionFilters = {
  search?: string;
  type?: "INCOME" | "EXPENSE";
  categoryId?: string;
  month?: number;
  year?: number;
  page?: number;
};

const PAGE_SIZE = 10;

export async function listTransactions(userId: string, filters: TransactionFilters) {
  const { search, type, categoryId, month, year, page = 1 } = filters;

  const where = {
    userId,
    type,
    categoryId,
    description: search ? { contains: search } : undefined,
    date: month && year ? monthRange(month, year) : undefined,
  };

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { items, total };
}

async function validate(userId: string, { amount, categoryId }: TransactionInput) {
  if (amount <= 0) {
    throw new Error("O valor deve ser maior que zero");
  }

  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) {
    throw new Error("Categoria não encontrada");
  }
}

async function findOwnTransaction(userId: string, id: string) {
  const transaction = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!transaction) {
    throw new Error("Transação não encontrada");
  }

  return transaction;
}
