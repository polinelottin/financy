import { beforeEach, describe, expect, it } from "vitest";
import { createCategory, createUser } from "../../test/factories";
import { getSummary } from "./summary-service";
import { createTransaction } from "./transaction-service";

let userId: string;
let categoryId: string;

beforeEach(async () => {
  userId = (await createUser()).id;
  categoryId = (await createCategory(userId)).id;
});

function addTransaction(type: "INCOME" | "EXPENSE", amount: number, date: string, owner = { userId, categoryId }) {
  return createTransaction(owner.userId, {
    description: "Transação",
    amount,
    type,
    date: new Date(date),
    categoryId: owner.categoryId,
  });
}

describe("getSummary", () => {
  it("calcula o saldo com todas as transações e as receitas e despesas do mês informado", async () => {
    await addTransaction("INCOME", 500000, "2025-10-05T00:00:00Z");
    await addTransaction("INCOME", 425000, "2025-11-01T00:00:00Z");
    await addTransaction("EXPENSE", 8950, "2025-11-30T23:59:59Z");
    await addTransaction("EXPENSE", 10000, "2025-11-15T00:00:00Z");
    await addTransaction("EXPENSE", 20000, "2025-12-01T00:00:00Z");

    const summary = await getSummary(userId, { month: 11, year: 2025 });

    expect(summary).toEqual({
      balance: 500000 + 425000 - 8950 - 10000 - 20000,
      monthIncome: 425000,
      monthExpense: 8950 + 10000,
    });
  });

  it("ignora transações de outros usuários", async () => {
    const otherUser = await createUser();
    const otherCategory = await createCategory(otherUser.id);
    await addTransaction("INCOME", 100000, "2025-11-10T00:00:00Z", {
      userId: otherUser.id,
      categoryId: otherCategory.id,
    });

    const summary = await getSummary(userId, { month: 11, year: 2025 });

    expect(summary).toEqual({ balance: 0, monthIncome: 0, monthExpense: 0 });
  });
});
