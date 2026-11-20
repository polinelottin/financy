import { prisma } from "../database/prisma";

export type CategoryInput = {
  title: string;
  description?: string | null;
  icon: string;
  color: string;
};

export async function createCategory(userId: string, input: CategoryInput) {
  validate(input);

  return prisma.category.create({ data: { ...input, userId } });
}

export async function updateCategory(userId: string, id: string, input: CategoryInput) {
  await findOwnCategory(userId, id);
  validate(input);

  return prisma.category.update({ where: { id }, data: input });
}

export async function deleteCategory(userId: string, id: string) {
  await findOwnCategory(userId, id);

  const transactionCount = await prisma.transaction.count({ where: { categoryId: id } });
  if (transactionCount > 0) {
    throw new Error("Não é possível excluir uma categoria com transações");
  }

  await prisma.category.delete({ where: { id } });
}

export async function listCategories(userId: string) {
  const [categories, totals] = await Promise.all([
    prisma.category.findMany({
      where: { userId },
      include: { _count: { select: { transactions: true } } },
      orderBy: { title: "asc" },
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId },
      _sum: { amount: true },
    }),
  ]);

  return categories.map(({ _count, ...category }) => ({
    ...category,
    transactionCount: _count.transactions,
    totalAmount: totals.find((t) => t.categoryId === category.id)?._sum.amount ?? 0,
  }));
}

function validate({ title }: CategoryInput) {
  if (!title.trim()) {
    throw new Error("Informe o título");
  }
}

async function findOwnCategory(userId: string, id: string) {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  return category;
}
