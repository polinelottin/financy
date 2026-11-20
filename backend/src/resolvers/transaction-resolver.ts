import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import type { Context } from "../context";
import { prisma } from "../database/prisma";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "../services/transaction-service";
import { Transaction, TransactionFilters, TransactionInput, TransactionPage } from "../types/transaction";

@Authorized()
@Resolver()
export class TransactionResolver {
  @Query(() => TransactionPage)
  transactions(
    @Arg("filters", () => TransactionFilters, { nullable: true }) filters: TransactionFilters | undefined,
    @Ctx() { userId }: Context,
  ) {
    return listTransactions(userId!, filters ?? {});
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Arg("input", () => TransactionInput) input: TransactionInput,
    @Ctx() { userId }: Context,
  ) {
    const { id } = await createTransaction(userId!, input);
    return findWithCategory(id);
  }

  @Mutation(() => Transaction)
  async updateTransaction(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => TransactionInput) input: TransactionInput,
    @Ctx() { userId }: Context,
  ) {
    await updateTransaction(userId!, id, input);
    return findWithCategory(id);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(@Arg("id", () => ID) id: string, @Ctx() { userId }: Context) {
    await deleteTransaction(userId!, id);
    return true;
  }
}

function findWithCategory(id: string) {
  return prisma.transaction.findUniqueOrThrow({ where: { id }, include: { category: true } });
}
