import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Plus, Search } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type CategoryWithTotals } from "@/features/categories/queries";
import { TRANSACTIONS, type Transaction } from "@/features/transactions/queries";
import { TransactionDialog } from "@/features/transactions/transaction-dialog";
import { TransactionsTable } from "@/features/transactions/transactions-table";
import { monthOptions } from "@/lib/format";

const PAGE_SIZE = 10;
const ALL = "all";
const months = monthOptions(new Date(), 12);
const periodValue = ({ month, year }: { month: number; year: number }) => `${month}-${year}`;

export function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState(ALL);
  const [categoryId, setCategoryId] = useState(ALL);
  const [period, setPeriod] = useState(periodValue(months[0]));
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{ open: boolean; transaction?: Transaction }>({ open: false });

  const [month, year] = period.split("-").map(Number);
  const { data } = useQuery<{ transactions: { items: Transaction[]; total: number } }>(TRANSACTIONS, {
    variables: {
      filters: {
        search: search || undefined,
        type: type === ALL ? undefined : type,
        categoryId: categoryId === ALL ? undefined : categoryId,
        month,
        year,
        page,
      },
    },
  });
  const { data: categoriesData } = useQuery<{ categories: CategoryWithTotals[] }>(CATEGORIES);

  function changeFilter<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-gray-600">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button onClick={() => setDialog({ open: true })} className="h-9 px-3">
          <Plus className="size-4" />
          Nova transação
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-6 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="search" className="text-gray-700">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              placeholder="Buscar por descrição"
              value={search}
              onChange={(event) => changeFilter(setSearch)(event.target.value)}
              className="h-12 bg-white pl-10 text-base md:text-base"
            />
          </div>
        </div>
        <FilterSelect label="Tipo" value={type} onChange={changeFilter(setType)}>
          <SelectItem value={ALL}>Todos</SelectItem>
          <SelectItem value="INCOME">Entrada</SelectItem>
          <SelectItem value="EXPENSE">Saída</SelectItem>
        </FilterSelect>
        <FilterSelect label="Categoria" value={categoryId} onChange={changeFilter(setCategoryId)}>
          <SelectItem value={ALL}>Todas</SelectItem>
          {categoriesData?.categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.title}
            </SelectItem>
          ))}
        </FilterSelect>
        <FilterSelect label="Período" value={period} onChange={changeFilter(setPeriod)}>
          {months.map((option) => (
            <SelectItem key={periodValue(option)} value={periodValue(option)}>
              {option.label}
            </SelectItem>
          ))}
        </FilterSelect>
      </div>

      <div className="rounded-xl border bg-white">
        <TransactionsTable
          transactions={data?.transactions.items ?? []}
          onEdit={(transaction) => setDialog({ open: true, transaction })}
        />
        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.transactions.total ?? 0} onPageChange={setPage} />
      </div>

      <TransactionDialog
        open={dialog.open}
        transaction={dialog.transaction}
        onOpenChange={(open) => setDialog((current) => ({ ...current, open }))}
      />
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
};

function FilterSelect({ label, value, onChange, children }: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-gray-700">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="lg" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
