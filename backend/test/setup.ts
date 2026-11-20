import { beforeEach } from "vitest";
import { prisma } from "../src/database/prisma";

beforeEach(async () => {
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
});
