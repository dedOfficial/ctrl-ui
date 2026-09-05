import { fileURLToPath } from "node:url";

// ctrlds is consumed through its workspace source so the catalog and its tests
// exercise the same files Storybook builds.
export const ctrldsAlias = {
  "ctrlds/variables.css": fileURLToPath(
    new URL("../../packages/ctrl-ui/src/tokens/generated/variables.css", import.meta.url),
  ),
  ctrlds: fileURLToPath(new URL("../../packages/ctrl-ui/src/index.ts", import.meta.url)),
};
