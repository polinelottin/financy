import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatTransactionAmount,
  fromApiDate,
  monthOptions,
  parseCents,
  toApiDate,
} from "./format";

describe("formatCurrency", () => {
  it("formata centavos em reais", () => {
    expect(formatCurrency(8950)).toMatch(/^R\$\s89,50$/);
    expect(formatCurrency(123456)).toMatch(/^R\$\s1\.234,56$/);
  });
});

describe("formatTransactionAmount", () => {
  it("usa + para receitas e - para despesas", () => {
    expect(formatTransactionAmount(34025, "INCOME")).toMatch(/^\+ R\$\s340,25$/);
    expect(formatTransactionAmount(8950, "EXPENSE")).toMatch(/^- R\$\s89,50$/);
  });
});

describe("parseCents", () => {
  it("lê os dígitos digitados como centavos", () => {
    expect(parseCents("89,50")).toBe(8950);
    expect(parseCents("R$ 1.234,56")).toBe(123456);
    expect(parseCents("")).toBe(0);
  });
});

describe("datas da API", () => {
  it("envia o dia escolhido ao meio-dia UTC, para não mudar de dia em nenhum fuso", () => {
    expect(toApiDate(new Date(2025, 10, 30))).toBe("2025-11-30T12:00:00.000Z");
  });

  it("converte a data da API de volta para o mesmo dia local", () => {
    const date = fromApiDate("2025-11-30T12:00:00.000Z");
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2025, 10, 30]);
  });

  it("formata como dd/mm/aa", () => {
    expect(formatDate("2025-11-30T12:00:00.000Z")).toBe("30/11/25");
  });
});

describe("monthOptions", () => {
  it("lista os meses do atual para trás", () => {
    const options = monthOptions(new Date(2026, 0, 15), 3);

    expect(options).toEqual([
      { month: 1, year: 2026, label: "Janeiro / 2026" },
      { month: 12, year: 2025, label: "Dezembro / 2025" },
      { month: 11, year: 2025, label: "Novembro / 2025" },
    ]);
  });
});
