import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

import { ctrldsAlias } from "../vite.alias.ts";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: ctrldsAlias,
      },
    });
  },
};

export default config;
