import { useMutation } from "@apollo/client/react";
import { CircleArrowDown, CircleArrowUp, SquarePen, Trash } from "lucide-react";
import { CategoryIcon, CategoryTag } from "@/components/category-badge";
import { formatDate, formatTransactionAmount } from "@/lib/format";
import { DELETE_TRANSACTION, type Transaction } from "./queries";

type TransactionsTableProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
};

export function TransactionsTable({ transactions, onEdit }: TransactionsTableProps) {
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, { refetchQueries: "active" });

  if (transactions.length === 0) {
    return <p className="px-6 py-12 text-center text-gray-500">Nenhuma transação encontrada</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-xs tracking-wide text-gray-500 uppercase">
          <tr>
            <th className="px-6 py-5 text-left font-medium">Descrição</th>
            <th className="px-6 py-5 text-center font-medium">Data</th>
            <th className="px-6 py-5 text-center font-medium">Categoria</th>
            <th className="px-6 py-5 text-center font-medium">Tipo</th>
            <th className="px-6 py-5 text-right font-medium">Valor</th>
            <th className="px-6 py-5 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <CategoryIcon category={transaction.category} />
                  <span className="font-medium text-gray-800">{transaction.description}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-gray-600">{formatDate(transaction.date)}</td>
              <td className="px-6 py-4 text-center">
                <CategoryTag category={transaction.category} />
              </td>
              <td className="px-6 py-4">
                <TypeLabel type={transaction.type} />
              </td>
              <td className="px-6 py-4 text-right font-semibold whitespace-nowrap text-gray-800">
                {formatTransactionAmount(transaction.amount, transaction.type)}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    aria-label="Excluir transação"
                    onClick={() => deleteTransaction({ variables: { id: transaction.id } })}
                    className="flex size-8 items-center justify-center rounded-lg border bg-white text-danger hover:bg-gray-100"
                  >
                    <Trash className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Editar transação"
                    onClick={() => onEdit(transaction)}
                    className="flex size-8 items-center justify-center rounded-lg border bg-white text-gray-700 hover:bg-gray-100"
                  >
                    <SquarePen className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TypeLabel({ type }: { type: Transaction["type"] }) {
  return type === "INCOME" ? (
    <span className="flex items-center justify-center gap-2 text-green-dark">
      <CircleArrowUp className="size-4" /> Entrada
    </span>
  ) : (
    <span className="flex items-center justify-center gap-2 text-red-dark">
      <CircleArrowDown className="size-4" /> Saída
    </span>
  );
}
