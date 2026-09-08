// @vitest-environment node
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { generateCss, generatedCssPath, writeGeneratedCss } from "./css.ts";
import { color, colorRoles, colorSchemes } from "./semantic/color.ts";
import { focusRing } from "./semantic/focus.ts";
import { motion } from "./semantic/motion.ts";
import { space, targetMinSize } from "./semantic/space.ts";

// Isolates one rule's declarations so a test cannot be satisfied by a string
// that happens to appear in some other block.
function blockFor(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) {
    throw new Error(`generateCss emitted no block for selector ${selector}`);
  }
  return css.slice(start, css.indexOf("}", start));
}

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

  describe("when emitting a color scheme", () => {
    it("declares color-scheme on each scheme block", () => {
      const css = generateCss();

      expect(blockFor(css, ":root, [data-scheme='light']")).toContain("color-scheme: light;");
      expect(blockFor(css, "[data-scheme='dark']")).toContain("color-scheme: dark;");
    });
  });

  describe("when emitting directional inset and space", () => {
    // Asserting the property name alone passes on a literal px copy, which is
    // the failure this guards: an alias must resolve through its source token so
    // a consumer override of --space-* moves the whole family.
    it("resolves every alias family through var() on its source token", () => {
      const css = generateCss();

      for (const name of Object.keys(space)) {
        expect(css).toContain(`--space-inline-${name}: var(--space-${name});`);
        expect(css).toContain(`--inset-inline-${name}: var(--space-${name});`);
        expect(css).toContain(`--inset-block-${name}: var(--space-${name});`);
      }

      expect(css).not.toMatch(/--(?:space-inline|inset-inline|inset-block)-[a-z]+:\s*[\d.]/);
    });

    it("omits utility and physical declarations", () => {
      const css = generateCss();

      expect(css).not.toContain("margin-inline:");
      expect(css).not.toContain("padding-inline:");
      expect(css).not.toMatch(/(?:^|[^-])(?:margin|padding)-left\s*:/m);
      expect(css).not.toMatch(/(?:^|[^-])(?:margin|padding)-right\s*:/m);
    });
  });
});
