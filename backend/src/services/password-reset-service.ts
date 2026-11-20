import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../database/prisma";
import { hashPassword } from "./auth-service";

const ONE_HOUR = 60 * 60 * 1000;

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: hash(token), passwordResetExpiresAt: new Date(Date.now() + ONE_HOUR) },
  });

  return `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;
}

export async function resetPassword(token: string, password: string) {
  const user = await prisma.user.findFirst({
    where: { passwordResetToken: hash(token), passwordResetExpiresAt: { gt: new Date() } },
  });
  if (!user) {
    throw new Error("Link inválido ou expirado");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(password), passwordResetToken: null, passwordResetExpiresAt: null },
  });
}

function hash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
