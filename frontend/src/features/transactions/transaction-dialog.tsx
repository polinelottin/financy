import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client/react";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { ptBR } from "react-day-picker/locale";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type CategoryWithTotals } from "@/features/categories/queries";
import { formatCurrency, fromApiDate, parseCents, toApiDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CREATE_TRANSACTION, UPDATE_TRANSACTION, type Transaction } from "./queries";

const schema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  description: z.string().trim().min(1, "Informe a descrição"),
  date: z.date({ error: "Selecione a data" }),
  amount: z.number().positive("Informe o valor"),
  categoryId: z.string().min(1, "Selecione a categoria"),
});

type FormData = z.infer<typeof schema>;

type TransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
};

export function TransactionDialog({ open, onOpenChange, transaction }: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-6 sm:max-w-112">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-800">
            {transaction ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>
        <TransactionForm transaction={transaction} onSaved={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function TransactionForm({ transaction, onSaved }: { transaction?: Transaction; onSaved: () => void }) {
  const { data } = useQuery<{ categories: CategoryWithTotals[] }>(CATEGORIES);
  const [createTransaction] = useMutation(CREATE_TRANSACTION, { refetchQueries: "active" });
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, { refetchQueries: "active" });
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          description: transaction.description,
          date: fromApiDate(transaction.date),
          amount: transaction.amount,
          categoryId: transaction.category.id,
        }
      : { type: "EXPENSE", description: "", amount: 0, categoryId: "" },
  });

  async function onSubmit({ date, ...values }: FormData) {
    const input = { ...values, date: toApiDate(date) };
    try {
      if (transaction) {
        await updateTransaction({ variables: { id: transaction.id, input } });
      } else {
        await createTransaction({ variables: { input } });
      }
      onSaved();
    } catch (error) {
      setError("root", { message: (error as Error).message });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2 rounded-xl border p-2">
            <TypeOption
              selected={field.value === "EXPENSE"}
              onSelect={() => field.onChange("EXPENSE")}
              icon={<CircleArrowDown className={cn("size-4", field.value === "EXPENSE" && "text-red-base")} />}
              label="Despesa"
              selectedClassName="border-red-base"
            />
            <TypeOption
              selected={field.value === "INCOME"}
              onSelect={() => field.onChange("INCOME")}
              icon={<CircleArrowUp className={cn("size-4", field.value === "INCOME" && "text-green-base")} />}
              label="Receita"
              selectedClassName="border-green-base"
            />
          </div>
        )}
      />

      <Field label="Descrição" htmlFor="description" error={errors.description?.message}>
        <Input
          id="description"
          placeholder="Ex. Almoço no restaurante"
          className="h-12 bg-white text-base md:text-base"
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Data" error={errors.date?.message}>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} invalid={Boolean(errors.date)} />
            )}
          />
        </Field>

        <Field label="Valor" htmlFor="amount" error={errors.amount?.message}>
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-base text-gray-800">R$</span>
                <Input
                  id="amount"
                  inputMode="numeric"
                  value={formatCurrency(field.value).replace(/^R\$\s/, "")}
                  onChange={(event) => field.onChange(parseCents(event.target.value))}
                  aria-invalid={Boolean(errors.amount)}
                  className="h-12 bg-white pl-10 text-base md:text-base"
                />
              </div>
            )}
          />
        </Field>
      </div>

      <Field label="Categoria" error={errors.categoryId?.message}>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger size="lg" aria-invalid={Boolean(errors.categoryId)}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {data?.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      {errors.root && <p className="text-center text-sm text-danger">{errors.root.message}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 h-12 text-base">
        Salvar
      </Button>
    </form>
  );
}

type DatePickerProps = { value?: Date; onChange: (date?: Date) => void; invalid: boolean };

function DatePicker({ value, onChange, invalid }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-invalid={invalid}
          className={cn(
            "flex h-12 items-center rounded-lg border border-input bg-white px-3 text-left text-base aria-invalid:border-destructive",
            !value && "text-gray-400",
          )}
        >
          {value ? value.toLocaleDateString("pt-BR") : "Selecione"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

type TypeOptionProps = {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  selectedClassName: string;
};

function TypeOption({ selected, onSelect, icon, label, selectedClassName }: TypeOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-lg border border-transparent text-base",
        selected ? cn("font-medium text-gray-800", selectedClassName) : "text-gray-600",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

type FieldProps = { label: string; htmlFor?: string; error?: string; children: React.ReactNode };

function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor} className="text-gray-700">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
