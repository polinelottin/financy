import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import type { Context } from "../context";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../services/category-service";
import { Category, CategoryInput, CategoryWithTotals } from "../types/category";

@Authorized()
@Resolver()
export class CategoryResolver {
  @Query(() => [CategoryWithTotals])
  categories(@Ctx() { userId }: Context) {
    return listCategories(userId!);
  }

  @Mutation(() => Category)
  createCategory(@Arg("input", () => CategoryInput) input: CategoryInput, @Ctx() { userId }: Context) {
    return createCategory(userId!, input);
  }

  @Mutation(() => Category)
  updateCategory(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => CategoryInput) input: CategoryInput,
    @Ctx() { userId }: Context,
  ) {
    return updateCategory(userId!, id, input);
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg("id", () => ID) id: string, @Ctx() { userId }: Context) {
    await deleteCategory(userId!, id);
    return true;
  }
}
