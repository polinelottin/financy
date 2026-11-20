import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma";

type RegisterInput = { name: string; email: string; password: string };

export async function register({ name, email, password }: RegisterInput) {
  if (password.length < 8) {
    throw new Error("A senha deve ter no mínimo 8 caracteres");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("E-mail já cadastrado");
  }

  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10) },
  });

  return { token: createToken(user.id), user };
}

type LoginInput = { email: string; password: string };

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("E-mail ou senha inválidos");
  }

  return { token: createToken(user.id), user };
}

function createToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}
