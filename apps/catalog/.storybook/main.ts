import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: {
          "ctrlds/variables.css": fileURLToPath(
            new URL(
              "../../../packages/ctrl-ui/src/tokens/generated/variables.css",
              import.meta.url,
            ),
          ),
          ctrlds: fileURLToPath(new URL("../../../packages/ctrl-ui/src/index.ts", import.meta.url)),
        },
      },
    });
  },
};

export default config;
