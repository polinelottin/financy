import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../database/prisma";
import { createCategory, createUser } from "../../test/factories";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "./transaction-service";

let userId: string;
let categoryId: string;

const input = () => ({
  description: "Jantar no Restaurante",
  amount: 8950,
  type: "EXPENSE" as const,
  date: new Date("2025-11-30"),
  categoryId,
});

beforeEach(async () => {
  userId = (await createUser()).id;
  categoryId = (await createCategory(userId)).id;
});

async function createOtherUsersCategory() {
  const otherUser = await createUser();
  return createCategory(otherUser.id);
}

describe("createTransaction", () => {
  it("cria a transação para o usuário", async () => {
    const transaction = await createTransaction(userId, input());

    expect(transaction).toMatchObject({ ...input(), userId });
  });

  it("recusa categoria de outro usuário", async () => {
    const otherCategory = await createOtherUsersCategory();

    await expect(
      createTransaction(userId, { ...input(), categoryId: otherCategory.id }),
    ).rejects.toThrow("Categoria não encontrada");
  });

  it("exige valor maior que zero", async () => {
    await expect(createTransaction(userId, { ...input(), amount: 0 })).rejects.toThrow(
      "O valor deve ser maior que zero",
    );
  });
});

describe("updateTransaction", () => {
  it("atualiza a transação", async () => {
    const { id } = await createTransaction(userId, input());

    const updated = await updateTransaction(userId, id, { ...input(), description: "Almoço", type: "INCOME" });

    expect(updated).toMatchObject({ id, description: "Almoço", type: "INCOME" });
  });

  it("recusa transação de outro usuário", async () => {
    const { id } = await createTransaction(userId, input());
    const otherUser = await createUser();

    await expect(updateTransaction(otherUser.id, id, input())).rejects.toThrow("Transação não encontrada");
  });

  it("recusa mover para categoria de outro usuário", async () => {
    const { id } = await createTransaction(userId, input());
    const otherCategory = await createOtherUsersCategory();

    await expect(
      updateTransaction(userId, id, { ...input(), categoryId: otherCategory.id }),
    ).rejects.toThrow("Categoria não encontrada");
  });
});

describe("deleteTransaction", () => {
  it("remove a transação", async () => {
    const { id } = await createTransaction(userId, input());

    await deleteTransaction(userId, id);

    expect(await prisma.transaction.findUnique({ where: { id } })).toBeNull();
  });

  it("recusa transação de outro usuário", async () => {
    const { id } = await createTransaction(userId, input());
    const otherUser = await createUser();

    await expect(deleteTransaction(otherUser.id, id)).rejects.toThrow("Transação não encontrada");
    expect(await prisma.transaction.findUnique({ where: { id } })).not.toBeNull();
  });
});

describe("listTransactions", () => {
  const descriptions = (result: { items: { description: string }[] }) =>
    result.items.map((t) => t.description);

  it("lista só as transações do usuário, das mais recentes para as mais antigas", async () => {
    await createTransaction(userId, { ...input(), description: "Antiga", date: new Date("2025-11-01") });
    await createTransaction(userId, { ...input(), description: "Recente", date: new Date("2025-11-20") });
    const otherUser = await createUser();
    const otherCategory = await createCategory(otherUser.id);
    await createTransaction(otherUser.id, { ...input(), description: "De outro", categoryId: otherCategory.id });

    const result = await listTransactions(userId, {});

    expect(descriptions(result)).toEqual(["Recente", "Antiga"]);
    expect(result.total).toBe(2);
  });

  it("busca pela descrição", async () => {
    await createTransaction(userId, { ...input(), description: "Jantar no Restaurante" });
    await createTransaction(userId, { ...input(), description: "Posto de Gasolina" });

    const result = await listTransactions(userId, { search: "jantar" });

    expect(descriptions(result)).toEqual(["Jantar no Restaurante"]);
  });

  it("filtra por tipo", async () => {
    await createTransaction(userId, { ...input(), description: "Salário", type: "INCOME" });
    await createTransaction(userId, { ...input(), description: "Mercado", type: "EXPENSE" });

    const result = await listTransactions(userId, { type: "INCOME" });

    expect(descriptions(result)).toEqual(["Salário"]);
  });

  it("filtra por categoria", async () => {
    const transport = await createCategory(userId, "Transporte");
    await createTransaction(userId, { ...input(), description: "Gasolina", categoryId: transport.id });
    await createTransaction(userId, { ...input(), description: "Jantar" });

    const result = await listTransactions(userId, { categoryId: transport.id });

    expect(descriptions(result)).toEqual(["Gasolina"]);
  });

  it("filtra por mês e ano", async () => {
    await createTransaction(userId, { ...input(), description: "Outubro", date: new Date("2025-10-31T23:59:59Z") });
    await createTransaction(userId, { ...input(), description: "Novembro", date: new Date("2025-11-01T00:00:00Z") });
    await createTransaction(userId, { ...input(), description: "Dezembro", date: new Date("2025-12-01T00:00:00Z") });

    const result = await listTransactions(userId, { month: 11, year: 2025 });

    expect(descriptions(result)).toEqual(["Novembro"]);
  });

  it("pagina de 10 em 10 e informa o total", async () => {
    for (let day = 1; day <= 12; day++) {
      await createTransaction(userId, { ...input(), description: `Dia ${day}`, date: new Date(Date.UTC(2025, 10, day)) });
    }

    const page2 = await listTransactions(userId, { page: 2 });

    expect(descriptions(page2)).toEqual(["Dia 2", "Dia 1"]);
    expect(page2.total).toBe(12);
  });
});
