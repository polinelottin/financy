import { prisma } from "../database/prisma";

export async function updateProfile(userId: string, { name }: { name: string }) {
  if (!name.trim()) {
    throw new Error("Informe o nome");
  }

  return prisma.user.update({ where: { id: userId }, data: { name: name.trim() } });
}
