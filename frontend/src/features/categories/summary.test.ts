import { describe, expect, it } from "vitest";
import { summarizeCategories } from "./summary";

const category = (title: string, transactionCount: number) => ({
  id: title,
  title,
  description: null,
  icon: "tag",
  color: "blue",
  transactionCount,
  totalAmount: 0,
});

describe("summarizeCategories", () => {
  it("conta categorias e transações e encontra a mais utilizada", () => {
    const summary = summarizeCategories([category("Mercado", 3), category("Alimentação", 12), category("Saúde", 0)]);

    expect(summary.categoryCount).toBe(3);
    expect(summary.transactionCount).toBe(15);
    expect(summary.mostUsed?.title).toBe("Alimentação");
  });

  it("não aponta categoria mais utilizada quando nenhuma tem transações", () => {
    expect(summarizeCategories([category("Saúde", 0)]).mostUsed).toBeUndefined();
    expect(summarizeCategories([]).mostUsed).toBeUndefined();
  });
});
