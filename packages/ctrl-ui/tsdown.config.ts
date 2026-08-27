import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm"],
  copy: {
    from: "src/tokens/generated/variables.css",
    to: "dist/tokens/generated",
  },
});
