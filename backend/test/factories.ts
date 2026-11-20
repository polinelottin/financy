import { prisma } from "../src/database/prisma";

let sequence = 0;

export function createUser() {
  sequence++;
  return prisma.user.create({
    data: { name: `Usuário ${sequence}`, email: `usuario${sequence}@teste.com`, password: "hash" },
  });
}

export function createCategory(userId: string, title = "Alimentação") {
  return prisma.category.create({
    data: { title, icon: "utensils", color: "blue", userId },
  });
}
