import { describe, expect, it } from "vitest";

import { typography as primitiveTypography } from "./primitive/typography.ts";
import { typography } from "./semantic/typography.ts";

describe("typography", () => {
  describe("when reading the family token", () => {
    it("names Inter with a system-ui fallback stack", () => {
      expect(primitiveTypography.familyName).toBe("Inter");
      expect(typography.family).toBe("Inter, system-ui, sans-serif");
    });
  });

  describe("when reading size steps", () => {
    it("exposes sm, md, lg, and xl CSS pixel values", () => {
      expect(typography.size.sm).toBe("14px");
      expect(typography.size.md).toBe("16px");
      expect(typography.size.lg).toBe("20px");
      expect(typography.size.xl).toBe("24px");
    });
  });

  describe("when reading line-height steps", () => {
    it("maps named steps onto the primitive scale", () => {
      expect(typography.lineHeight.sm).toBe(`${primitiveTypography.lineHeight[20]}px`);
      expect(typography.lineHeight.md).toBe(`${primitiveTypography.lineHeight[24]}px`);
      expect(typography.lineHeight.lg).toBe(`${primitiveTypography.lineHeight[28]}px`);
      expect(typography.lineHeight.xl).toBe(`${primitiveTypography.lineHeight[32]}px`);
    });
  });

  describe("when reading weight steps", () => {
    it("exposes 400, 500, 600, and 700", () => {
      expect(typography.weight.regular).toBe("400");
      expect(typography.weight.medium).toBe("500");
      expect(typography.weight.semibold).toBe("600");
      expect(typography.weight.bold).toBe("700");
    });
  });
});
