// @vitest-environment node
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { generateCss, generatedCssPath, writeGeneratedCss } from "./css.ts";
import { color, colorRoles, colorSchemes } from "./semantic/color.ts";
import { focusRing } from "./semantic/focus.ts";
import { motion } from "./semantic/motion.ts";
import { targetMinSize } from "./semantic/space.ts";

describe("generateCss", () => {
  describe("when the committed dump is current", () => {
    it("matches packages/ctrl-ui/src/tokens/generated/variables.css", () => {
      const committed = readFileSync(generatedCssPath, "utf8");

      expect(committed).toBe(generateCss());
    });
  });

  describe("when writing a dump", () => {
    it("writes the generated CSS to the given path", () => {
      const outputPath = join(mkdtempSync(join(tmpdir(), "ctrlds-css-")), "variables.css");

      writeGeneratedCss({ outputPath });

      expect(readFileSync(outputPath, "utf8")).toBe(generateCss());
    });
  });

  describe("when emitting color roles", () => {
    it("includes a custom property for every semantic color role in both schemes", () => {
      const css = generateCss();

      expect(css).toContain(":root, [data-scheme='light']");
      expect(css).toContain("[data-scheme='dark']");

      for (const scheme of colorSchemes) {
        for (const role of colorRoles) {
          expect(css).toContain(`--color-${role}: ${color[scheme][role]};`);
        }
      }
    });
  });

  describe("when emitting shared contract tokens", () => {
    it("emits CSS custom property names for space, radius, font, density, direction, and focus ring", () => {
      const css = generateCss();

      expect(css).toContain(":root, [data-scheme]");
      expect(css).toContain(":root, [dir='ltr']");
      expect(css).toContain("[dir='rtl']");
      expect(css).toContain("--space-md:");
      expect(css).toContain("--space-xxl:");
      expect(css).toContain("--radius-sm:");
      expect(css).toContain("--font-family: Inter, system-ui, sans-serif;");
      expect(css).toContain("--density-comfortable:");
      expect(css).toContain("--direction: ltr;");
      expect(css).toContain("--direction: rtl;");
      expect(css).toContain(`--focus-ring-width: ${focusRing.width};`);
      expect(css).toContain(`--focus-ring-offset: ${focusRing.offset};`);
      expect(css).toContain(`--target-min-size: ${targetMinSize};`);
      expect(css).toContain(`--motion-duration: ${motion.duration};`);
      expect(css).toContain(motion.reducedMotionQuery);
      expect(css).toContain(`--motion-duration: ${motion.reducedDuration};`);
    });
  });

  describe("when emitting directional inset and space", () => {
    it("uses logical custom properties and omits utility and physical declarations", () => {
      const css = generateCss();

      expect(css).toContain("--space-inline-sm:");
      expect(css).toContain("--inset-inline-md:");
      expect(css).toContain("--inset-block-md:");
      expect(css).not.toContain("margin-inline:");
      expect(css).not.toContain("padding-inline:");
      expect(css).not.toMatch(/(?:^|[^-])(?:margin|padding)-left\s*:/m);
      expect(css).not.toMatch(/(?:^|[^-])(?:margin|padding)-right\s*:/m);
    });
  });
});
