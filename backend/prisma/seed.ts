import { prisma } from "../src/database/prisma";
import { register } from "../src/services/auth-service";
import { createCategory } from "../src/services/category-service";
import { createTransaction } from "../src/services/transaction-service";

const user = { name: "Conta teste", email: "conta@teste.com", password: "12345678" };

const categories = [
  { title: "Alimentação", description: "Restaurantes, delivery e refeições", icon: "utensils", color: "blue" },
  { title: "Entretenimento", description: "Cinema, jogos e lazer", icon: "ticket", color: "pink" },
  { title: "Investimento", description: "Aplicações e retornos financeiros", icon: "piggy-bank", color: "green" },
  { title: "Mercado", description: "Compras de supermercado e mantimentos", icon: "shopping-cart", color: "orange" },
  { title: "Salário", description: "Renda mensal e bonificações", icon: "briefcase-business", color: "green" },
  { title: "Saúde", description: "Medicamentos, consultas e exames", icon: "heart-pulse", color: "red" },
  { title: "Transporte", description: "Gasolina, transporte público e viagens", icon: "car-front", color: "purple" },
  { title: "Utilidades", description: "Energia, água, internet e telefone", icon: "tool-case", color: "yellow" },
];

const transactions = [
  { description: "Pagamento de Salário", amount: 425000, type: "INCOME", date: "2025-12-01", category: "Salário" },
  { description: "Jantar no Restaurante", amount: 8950, type: "EXPENSE", date: "2025-11-30", category: "Alimentação" },
  { description: "Posto de Gasolina", amount: 10000, type: "EXPENSE", date: "2025-11-29", category: "Transporte" },
  { description: "Compras no Mercado", amount: 15680, type: "EXPENSE", date: "2025-11-28", category: "Mercado" },
  { description: "Retorno de Investimento", amount: 34025, type: "INCOME", date: "2025-11-26", category: "Investimento" },
  { description: "Aluguel", amount: 170000, type: "EXPENSE", date: "2025-11-26", category: "Utilidades" },
  { description: "Freelance", amount: 250000, type: "INCOME", date: "2025-11-24", category: "Salário" },
  { description: "Compras Jantar", amount: 15000, type: "EXPENSE", date: "2025-11-22", category: "Mercado" },
  { description: "Cinema", amount: 8800, type: "EXPENSE", date: "2025-11-18", category: "Entretenimento" },
  { description: "Pagamento de Salário", amount: 425000, type: "INCOME", date: "2025-11-01", category: "Salário" },
  { description: "Uber", amount: 3250, type: "EXPENSE", date: "2025-10-30", category: "Transporte" },
  { description: "Conta de Luz", amount: 18900, type: "EXPENSE", date: "2025-10-20", category: "Utilidades" },
] as const;

async function main() {
  await prisma.user.deleteMany({ where: { email: user.email } });
  const { user: created } = await register(user);

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const { id } = await createCategory(created.id, category);
    categoryIds.set(category.title, id);
  }

  for (const { category, date, ...transaction } of transactions) {
    await createTransaction(created.id, {
      ...transaction,
      date: new Date(`${date}T12:00:00Z`),
      categoryId: categoryIds.get(category)!,
    });
  }

  console.log(`Seed concluído. Login: ${user.email} / ${user.password}`);
}

main().finally(() => prisma.$disconnect());
