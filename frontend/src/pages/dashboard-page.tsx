import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from "lucide-react";
import { CategoryIcon, CategoryTag } from "@/components/category-badge";
import { CATEGORIES, type CategoryWithTotals } from "@/features/categories/queries";
import { TRANSACTIONS, type Transaction } from "@/features/transactions/queries";
import { TransactionDialog } from "@/features/transactions/transaction-dialog";
import { formatCurrency, formatDate, formatTransactionAmount } from "@/lib/format";

const SUMMARY = gql`
  query Summary($month: Int!, $year: Int!) {
    summary(month: $month, year: $year) {
      balance
      monthIncome
      monthExpense
    }
  }
`;

type Summary = { balance: number; monthIncome: number; monthExpense: number };

const RECENT_COUNT = 5;
const TOP_CATEGORIES_COUNT = 5;

export function DashboardPage() {
  const [today] = useState(() => new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: summaryData } = useQuery<{ summary: Summary }>(SUMMARY, {
    variables: { month: today.getMonth() + 1, year: today.getFullYear() },
  });
  const { data: transactionsData } = useQuery<{ transactions: { items: Transaction[] } }>(TRANSACTIONS);
  const { data: categoriesData } = useQuery<{ categories: CategoryWithTotals[] }>(CATEGORIES);

  const summary = summaryData?.summary;
  const recent = transactionsData?.transactions.items.slice(0, RECENT_COUNT) ?? [];
  const topCategories = [...(categoriesData?.categories ?? [])]
    .filter((category) => category.transactionCount > 0)
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, TOP_CATEGORIES_COUNT);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard icon={<Wallet className="size-5 text-purple-base" />} label="Saldo total" value={summary?.balance} />
        <SummaryCard
          icon={<CircleArrowUp className="size-5 text-green-base" />}
          label="Receitas do mês"
          value={summary?.monthIncome}
        />
        <SummaryCard
          icon={<CircleArrowDown className="size-5 text-red-base" />}
          label="Despesas do mês"
          value={summary?.monthExpense}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <section className="rounded-xl border bg-white lg:col-span-2">
          <SectionHeader title="Transações recentes" linkTo="/transacoes" linkLabel="Ver todas" />
          <ul>
            {recent.map((transaction) => (
              <li key={transaction.id} className="flex items-center gap-4 border-b px-6 py-4">
                <CategoryIcon category={transaction.category} />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="font-medium text-gray-800">{transaction.description}</span>
                  <span className="text-sm text-gray-600">{formatDate(transaction.date)}</span>
                </div>
                <CategoryTag category={transaction.category} />
                <span className="flex w-40 items-center justify-end gap-2 text-sm font-semibold whitespace-nowrap text-gray-800">
                  {formatTransactionAmount(transaction.amount, transaction.type)}
                  {transaction.type === "INCOME" ? (
                    <CircleArrowUp className="size-4 text-green-base" />
                  ) : (
                    <CircleArrowDown className="size-4 text-red-base" />
                  )}
                </span>
              </li>
            ))}
            {recent.length === 0 && <li className="px-6 py-8 text-center text-gray-500">Nenhuma transação ainda</li>}
          </ul>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex w-full items-center justify-center gap-1 py-5 text-sm font-medium text-brand-base hover:text-brand-dark"
          >
            <Plus className="size-4" />
            Nova transação
          </button>
        </section>

        <section className="rounded-xl border bg-white">
          <SectionHeader title="Categorias" linkTo="/categorias" linkLabel="Gerenciar" />
          <ul className="flex flex-col gap-5 p-6">
            {topCategories.map((category) => (
              <li key={category.id} className="flex items-center gap-3 text-sm">
                <span className="flex-1">
                  <CategoryTag category={category} />
                </span>
                <span className="text-gray-600">
                  {category.transactionCount} {category.transactionCount === 1 ? "item" : "itens"}
                </span>
                <span className="w-24 text-right font-semibold text-gray-800">
                  {formatCurrency(category.totalAmount)}
                </span>
              </li>
            ))}
            {topCategories.length === 0 && <li className="text-center text-gray-500">Nenhuma categoria em uso</li>}
          </ul>
        </section>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value?: number }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-white p-6">
      <span className="flex items-center gap-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
        {icon}
        {label}
      </span>
      <span className="text-3xl font-bold text-gray-800">{value === undefined ? "—" : formatCurrency(value)}</span>
    </div>
  );
}

function SectionHeader({ title, linkTo, linkLabel }: { title: string; linkTo: string; linkLabel: string }) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-5">
      <h2 className="text-xs font-medium tracking-wide text-gray-500 uppercase">{title}</h2>
      <Link to={linkTo} className="flex items-center gap-1 text-sm font-medium text-brand-base hover:text-brand-dark">
        {linkLabel}
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
