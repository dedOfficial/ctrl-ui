import { defineConfig } from "vitest/config";

import { ctrldsAlias } from "./vite.alias.ts";

export default defineConfig({
  resolve: {
    alias: ctrldsAlias,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./.storybook/vitest.setup.ts"],
  },
});
