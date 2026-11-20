export type TransactionType = "INCOME" | "EXPENSE";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatCurrency(cents: number) {
  return currency.format(cents / 100);
}

export function formatTransactionAmount(cents: number, type: TransactionType) {
  return `${type === "INCOME" ? "+" : "-"} ${formatCurrency(cents)}`;
}

export function parseCents(text: string) {
  return Number(text.replace(/\D/g, ""));
}

export function toApiDate(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12)).toISOString();
}

export function fromApiDate(iso: string) {
  const date = new Date(iso);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function formatDate(iso: string) {
  return fromApiDate(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function monthOptions(today: Date, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { month, year, label: `${MONTHS[month - 1]} / ${year}` };
  });
}
