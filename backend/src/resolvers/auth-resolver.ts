import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import type { Context } from "../context";
import { prisma } from "../database/prisma";
import { login, register } from "../services/auth-service";
import { updateProfile } from "../services/user-service";
import { AuthPayload, LoginInput, RegisterInput, UpdateProfileInput, User } from "../types/user";

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthPayload)
  register(@Arg("input", () => RegisterInput) input: RegisterInput) {
    return register(input);
  }

  @Mutation(() => AuthPayload)
  login(@Arg("input", () => LoginInput) input: LoginInput) {
    return login(input);
  }

  @Authorized()
  @Query(() => User)
  me(@Ctx() { userId }: Context) {
    return prisma.user.findUniqueOrThrow({ where: { id: userId } });
  }

  @Authorized()
  @Mutation(() => User)
  updateProfile(
    @Arg("input", () => UpdateProfileInput) input: UpdateProfileInput,
    @Ctx() { userId }: Context,
  ) {
    return updateProfile(userId!, input);
  }
}
