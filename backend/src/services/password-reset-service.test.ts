import { describe, expect, it } from "vitest";
import { prisma } from "../database/prisma";
import { login, register } from "./auth-service";
import { requestPasswordReset, resetPassword } from "./password-reset-service";

const user = { name: "Conta teste", email: "conta@teste.com", password: "12345678" };

function tokenFrom(link: string) {
  return new URL(link).searchParams.get("token")!;
}

describe("requestPasswordReset", () => {
  it("gera um link de redefinição para o e-mail cadastrado", async () => {
    await register(user);

    const link = await requestPasswordReset(user.email);

    expect(link).toMatch(/^http:\/\/localhost:5173\/redefinir-senha\?token=\w+/);
  });

  it("guarda só o hash do token, com validade de 1 hora", async () => {
    await register(user);
    const before = Date.now();

    const link = await requestPasswordReset(user.email);

    const saved = await prisma.user.findUniqueOrThrow({ where: { email: user.email } });
    expect(saved.passwordResetToken).toBeTruthy();
    expect(saved.passwordResetToken).not.toBe(tokenFrom(link!));
    expect(saved.passwordResetExpiresAt!.getTime() - before).toBeGreaterThanOrEqual(60 * 60 * 1000 - 1000);
  });

  it("não informa se o e-mail não está cadastrado", async () => {
    await expect(requestPasswordReset("nao@existe.com")).resolves.toBeNull();
  });
});

describe("resetPassword", () => {
  async function requestToken() {
    await register(user);
    return tokenFrom((await requestPasswordReset(user.email))!);
  }

  it("troca a senha e permite entrar com a nova", async () => {
    const token = await requestToken();

    await resetPassword(token, "nova-senha-123");

    await expect(login({ email: user.email, password: "nova-senha-123" })).resolves.toBeTruthy();
    await expect(login(user)).rejects.toThrow("E-mail ou senha inválidos");
  });

  it("aceita o token uma única vez", async () => {
    const token = await requestToken();
    await resetPassword(token, "nova-senha-123");

    await expect(resetPassword(token, "outra-senha-123")).rejects.toThrow("Link inválido ou expirado");
  });

  it("recusa token desconhecido", async () => {
    await requestToken();

    await expect(resetPassword("token-inventado", "nova-senha-123")).rejects.toThrow("Link inválido ou expirado");
  });

  it("recusa token expirado", async () => {
    const token = await requestToken();
    await prisma.user.update({
      where: { email: user.email },
      data: { passwordResetExpiresAt: new Date(Date.now() - 1000) },
    });

    await expect(resetPassword(token, "nova-senha-123")).rejects.toThrow("Link inválido ou expirado");
  });

  it("exige senha com no mínimo 8 caracteres", async () => {
    const token = await requestToken();

    await expect(resetPassword(token, "1234567")).rejects.toThrow("A senha deve ter no mínimo 8 caracteres");
  });
});
