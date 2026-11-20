import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../database/prisma";
import { createUser } from "../../test/factories";
import { createCategory, deleteCategory, listCategories, updateCategory } from "./category-service";
import { createTransaction } from "./transaction-service";

let userId: string;

const input = { title: "Alimentação", description: "Restaurantes e delivery", icon: "utensils", color: "blue" };

beforeEach(async () => {
  userId = (await createUser()).id;
});

function addTransaction(categoryId: string, amount: number) {
  return createTransaction(userId, {
    description: "Compra",
    amount,
    type: "EXPENSE",
    date: new Date("2025-11-30"),
    categoryId,
  });
}

describe("createCategory", () => {
  it("cria a categoria para o usuário", async () => {
    const category = await createCategory(userId, input);

    expect(category).toMatchObject({ ...input, userId });
  });

  it("exige título", async () => {
    await expect(createCategory(userId, { ...input, title: " " })).rejects.toThrow("Informe o título");
  });
});

describe("updateCategory", () => {
  it("atualiza a categoria", async () => {
    const { id } = await createCategory(userId, input);

    const updated = await updateCategory(userId, id, { ...input, title: "Mercado", color: "orange" });

    expect(updated).toMatchObject({ id, title: "Mercado", color: "orange" });
  });

  it("recusa categoria de outro usuário", async () => {
    const { id } = await createCategory(userId, input);
    const otherUser = await createUser();

    await expect(updateCategory(otherUser.id, id, input)).rejects.toThrow("Categoria não encontrada");
  });

  it("exige título", async () => {
    const { id } = await createCategory(userId, input);

    await expect(updateCategory(userId, id, { ...input, title: "" })).rejects.toThrow("Informe o título");
  });
});

describe("deleteCategory", () => {
  it("remove a categoria", async () => {
    const { id } = await createCategory(userId, input);

    await deleteCategory(userId, id);

    expect(await prisma.category.findUnique({ where: { id } })).toBeNull();
  });

  it("recusa categoria de outro usuário", async () => {
    const { id } = await createCategory(userId, input);
    const otherUser = await createUser();

    await expect(deleteCategory(otherUser.id, id)).rejects.toThrow("Categoria não encontrada");
  });

  it("não remove categoria com transações", async () => {
    const { id } = await createCategory(userId, input);
    await addTransaction(id, 1000);

    await expect(deleteCategory(userId, id)).rejects.toThrow(
      "Não é possível excluir uma categoria com transações",
    );
  });
});

describe("listCategories", () => {
  it("lista só as categorias do usuário, em ordem alfabética, com quantidade e total das transações", async () => {
    const transport = await createCategory(userId, { ...input, title: "Transporte" });
    const food = await createCategory(userId, { ...input, title: "Alimentação" });
    await createCategory(userId, { ...input, title: "Saúde" });
    await addTransaction(food.id, 8950);
    await addTransaction(food.id, 15680);
    await addTransaction(transport.id, 10000);
    const otherUser = await createUser();
    await createCategory(otherUser.id, input);

    const categories = await listCategories(userId);

    expect(categories.map((c) => [c.title, c.transactionCount, c.totalAmount])).toEqual([
      ["Alimentação", 2, 24630],
      ["Saúde", 0, 0],
      ["Transporte", 1, 10000],
    ]);
  });
});
