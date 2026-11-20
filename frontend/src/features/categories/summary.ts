import type { CategoryWithTotals } from "./queries";

export function summarizeCategories(categories: CategoryWithTotals[]) {
  const used = categories.filter((category) => category.transactionCount > 0);
  const mostUsed = used.reduce<CategoryWithTotals | undefined>(
    (best, category) => (!best || category.transactionCount > best.transactionCount ? category : best),
    undefined,
  );

  return {
    categoryCount: categories.length,
    transactionCount: categories.reduce((sum, category) => sum + category.transactionCount, 0),
    mostUsed,
  };
}
