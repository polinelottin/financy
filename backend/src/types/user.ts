import { Field, ID, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;
}

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string;

  @Field(() => User)
  user!: User;
}

@InputType()
export class RegisterInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class UpdateProfileInput {
  @Field(() => String)
  name!: string;
}
