import { Field, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Category } from "./category";

export const TransactionType = { INCOME: "INCOME", EXPENSE: "EXPENSE" } as const;
type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

registerEnumType(TransactionType, { name: "TransactionType" });

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  description!: string;

  @Field(() => Int, { description: "Valor em centavos" })
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => Date)
  date!: Date;

  @Field(() => Category)
  category!: Category;
}

@ObjectType()
export class TransactionPage {
  @Field(() => [Transaction])
  items!: Transaction[];

  @Field(() => Int)
  total!: number;
}

@InputType()
export class TransactionInput {
  @Field(() => String)
  description!: string;

  @Field(() => Int, { description: "Valor em centavos" })
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => Date)
  date!: Date;

  @Field(() => String)
  categoryId!: string;
}

@InputType()
export class TransactionFilters {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Int, { nullable: true })
  month?: number;

  @Field(() => Int, { nullable: true })
  year?: number;

  @Field(() => Int, { nullable: true })
  page?: number;
}
