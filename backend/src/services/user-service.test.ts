import { describe, expect, it } from "vitest";
import { register } from "./auth-service";
import { updateProfile } from "./user-service";

describe("updateProfile", () => {
  it("altera o nome do usuário", async () => {
    const { user } = await register({ name: "Conta teste", email: "conta@teste.com", password: "12345678" });

    const updated = await updateProfile(user.id, { name: "Novo nome" });

    expect(updated).toMatchObject({ id: user.id, name: "Novo nome", email: "conta@teste.com" });
  });

  it("exige nome preenchido", async () => {
    const { user } = await register({ name: "Conta teste", email: "conta@teste.com", password: "12345678" });

    await expect(updateProfile(user.id, { name: "  " })).rejects.toThrow("Informe o nome");
  });
});
