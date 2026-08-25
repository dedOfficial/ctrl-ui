import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "jsx-a11y", "vitest", "import"],
  ignorePatterns: ["**/dist/**", "**/coverage/**", "**/storybook-static/**", "**/node_modules/**"],
  settings: {
    react: {
      version: "19",
    },
  },
});
