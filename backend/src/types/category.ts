import { Field, ID, InputType, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Category {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String)
  icon!: string;

  @Field(() => String)
  color!: string;
}

@ObjectType()
export class CategoryWithTotals extends Category {
  @Field(() => Int)
  transactionCount!: number;

  @Field(() => Int, { description: "Soma dos valores das transações, em centavos" })
  totalAmount!: number;
}

@InputType()
export class CategoryInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  icon!: string;

  @Field(() => String)
  color!: string;
}
