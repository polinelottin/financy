import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import type { Context } from "../context";
import { prisma } from "../database/prisma";
import { login, register } from "../services/auth-service";
import { requestPasswordReset, resetPassword } from "../services/password-reset-service";
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

  @Mutation(() => Boolean, { description: "O link é impresso no terminal da API, pois o projeto não envia e-mails" })
  async requestPasswordReset(@Arg("email", () => String) email: string) {
    const link = await requestPasswordReset(email);
    if (link) console.log(`Link de redefinição de senha para ${email}: ${link}`);
    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg("token", () => String) token: string,
    @Arg("password", () => String) password: string,
  ) {
    await resetPassword(token, password);
    return true;
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
