import { describe, expect, it } from "vitest";

import { radius as primitiveRadius } from "./primitive/radius.ts";
import { space as primitiveSpace } from "./primitive/space.ts";
import { density } from "./semantic/density.ts";
import { radius } from "./semantic/radius.ts";
import { space, targetMinSize } from "./semantic/space.ts";

describe("space", () => {
  describe("when reading semantic steps", () => {
    it("maps named steps onto the primitive scale", () => {
      expect(space.xs).toBe(`${primitiveSpace[4]}px`);
      expect(space.sm).toBe(`${primitiveSpace[8]}px`);
      expect(space.md).toBe(`${primitiveSpace[16]}px`);
      expect(space.lg).toBe(`${primitiveSpace[24]}px`);
      expect(space.xl).toBe(`${primitiveSpace[32]}px`);
      expect(space["2xl"]).toBe(`${primitiveSpace[48]}px`);
    });
  });

  describe("when reading the target size token", () => {
    it("is 24 CSS pixels", () => {
      expect(targetMinSize).toBe("24px");
      expect(targetMinSize).toBe(`${primitiveSpace[24]}px`);
    });
  });
});

describe("radius", () => {
  describe("when reading semantic steps", () => {
    it("exposes sm, md, lg, and full values", () => {
      expect(radius.sm).toBe(`${primitiveRadius[8]}px`);
      expect(radius.md).toBe(`${primitiveRadius[12]}px`);
      expect(radius.lg).toBe(`${primitiveRadius[16]}px`);
      expect(radius.full).toBe(`${primitiveRadius.pill}px`);
    });
  });
});

describe("density", () => {
  describe("when reading semantic steps", () => {
    it("exposes compact, comfortable, and spacious multipliers", () => {
      expect(density.compact).toBe(0.75);
      expect(density.comfortable).toBe(1);
      expect(density.spacious).toBe(1.25);
    });
  });
});
