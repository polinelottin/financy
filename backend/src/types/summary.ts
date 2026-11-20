import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "Valores em centavos" })
export class Summary {
  @Field(() => Int)
  balance!: number;

  @Field(() => Int)
  monthIncome!: number;

  @Field(() => Int)
  monthExpense!: number;
}
