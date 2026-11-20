import { Arg, Authorized, Ctx, Int, Query, Resolver } from "type-graphql";
import type { Context } from "../context";
import { getSummary } from "../services/summary-service";
import { Summary } from "../types/summary";

@Authorized()
@Resolver()
export class SummaryResolver {
  @Query(() => Summary)
  summary(
    @Arg("month", () => Int) month: number,
    @Arg("year", () => Int) year: number,
    @Ctx() { userId }: Context,
  ) {
    return getSummary(userId!, { month, year });
  }
}
