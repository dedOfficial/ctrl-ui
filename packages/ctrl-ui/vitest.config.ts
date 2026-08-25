import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      enabled: true,
      provider: "istanbul",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "src/index.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.stories.*",
        "**/*.d.ts",
        "src/tokens/generated/**",
      ],
      reporter: ["text", "text-summary"],
      skipFull: false,
      thresholds: {
        100: true,
        perFile: true,
      },
    },
  },
});
