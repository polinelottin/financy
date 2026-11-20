import { prisma } from "../database/prisma";
import { monthRange } from "./month-range";

export async function getSummary(userId: string, { month, year }: { month: number; year: number }) {
  const [allTime, monthTotals] = await Promise.all([
    sumByType({ userId }),
    sumByType({ userId, date: monthRange(month, year) }),
  ]);

  return {
    balance: allTime.INCOME - allTime.EXPENSE,
    monthIncome: monthTotals.INCOME,
    monthExpense: monthTotals.EXPENSE,
  };
}

async function sumByType(where: { userId: string; date?: { gte: Date; lt: Date } }) {
  const groups = await prisma.transaction.groupBy({ by: ["type"], where, _sum: { amount: true } });
  const sumOf = (type: string) => groups.find((g) => g.type === type)?._sum.amount ?? 0;

  return { INCOME: sumOf("INCOME"), EXPENSE: sumOf("EXPENSE") };
}
