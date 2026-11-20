import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: "file:./test.db",
      JWT_SECRET: "test-secret",
      FRONTEND_URL: "http://localhost:5173",
    },
    globalSetup: "./test/global-setup.ts",
    setupFiles: "./test/setup.ts",
    fileParallelism: false,
  },
});
