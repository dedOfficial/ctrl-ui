import { describe, expect, it } from "vitest";

import { generateCss } from "./css.ts";
import { direction } from "./semantic/direction.ts";

describe("direction", () => {
  describe("when reading the collection", () => {
    it("exposes ltr and rtl values", () => {
      expect(direction.ltr).toBe("ltr");
      expect(direction.rtl).toBe("rtl");
    });
  });

  describe("when the CSS dump encodes writing direction", () => {
    it("sets a dir contract and uses logical inset and space properties", () => {
      const css = generateCss();

      expect(css).toContain(":root, [dir='ltr']");
      expect(css).toContain("[dir='rtl']");
      expect(css).toContain("--direction: ltr;");
      expect(css).toContain("--direction: rtl;");
      expect(css).toContain("--space-inline-sm: var(--space-sm);");
      expect(css).toContain("--inset-inline-md: var(--space-md);");
      expect(css).toContain("--inset-block-md: var(--space-md);");
      expect(css).not.toContain("margin-inline:");
    });
  });
});
