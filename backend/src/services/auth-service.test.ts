import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma";
import { login, register } from "./auth-service";

const input = { name: "Conta teste", email: "conta@teste.com", password: "12345678" };

describe("register", () => {
  it("cria o usuário e retorna um token", async () => {
    const result = await register(input);

    expect(result.user).toMatchObject({ name: input.name, email: input.email });
    expect(result.token).toEqual(expect.any(String));
  });

  it("não salva a senha em texto puro", async () => {
    await register(input);

    const user = await prisma.user.findUniqueOrThrow({ where: { email: input.email } });
    expect(user.password).not.toBe(input.password);
  });

  it("não permite e-mail já cadastrado", async () => {
    await register(input);

    await expect(register(input)).rejects.toThrow("E-mail já cadastrado");
  });

  it("exige senha com no mínimo 8 caracteres", async () => {
    await expect(register({ ...input, password: "1234567" })).rejects.toThrow(
      "A senha deve ter no mínimo 8 caracteres",
    );
  });
});

describe("login", () => {
  it("retorna um token do usuário com credenciais válidas", async () => {
    const { user } = await register(input);

    const result = await login({ email: input.email, password: input.password });

    expect(result.user.id).toBe(user.id);
    expect(jwt.verify(result.token, process.env.JWT_SECRET!)).toMatchObject({ sub: user.id });
  });

  it("recusa senha errada", async () => {
    await register(input);

    await expect(login({ email: input.email, password: "senha-errada" })).rejects.toThrow(
      "E-mail ou senha inválidos",
    );
  });

  it("recusa e-mail não cadastrado", async () => {
    await expect(login({ email: "nao@existe.com", password: input.password })).rejects.toThrow(
      "E-mail ou senha inválidos",
    );
  });
});
