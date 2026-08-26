import { describe, expect, it } from "vitest";

import { color as primitiveColor, rampSteps } from "./primitive/color.ts";
import { color, colorRoles, colorSchemes } from "./semantic/color.ts";

describe("color", () => {
  describe("when reading primitive ramps", () => {
    it("exposes steps 50 through 900 on each hue family", () => {
      for (const ramp of Object.values(primitiveColor)) {
        expect(Object.keys(ramp).map(Number)).toEqual([...rampSteps]);
        for (const step of rampSteps) {
          expect(ramp[step]).toMatch(/^#[0-9A-Fa-f]{6}$/);
        }
      }
    });
  });

  describe("when reading the public collection", () => {
    it("omits primitive ramps and accent A100-A700 steps", () => {
      const serialized = JSON.stringify(color);

      expect(serialized).not.toContain("A100");
      expect(serialized).not.toContain("A200");
      expect(serialized).not.toContain("A400");
      expect(serialized).not.toContain("A700");
      expect(serialized).not.toContain("neutral");
    });
  });

  describe("when the light scheme is active", () => {
    it("resolves action to ink and on-action to glint", () => {
      expect(color.light.action).toBe("#000000");
      expect(color.light["on-action"]).toBe("#FFFFFF");
      expect(color.light.surface).toBe("#F2F2F2");
      expect(color.light["on-surface"]).toBe("#000000");
    });
  });

  describe("when the dark scheme is active", () => {
    it("resolves surface near ink and action to glint with inverted on-action", () => {
      expect(color.dark.surface).toBe("#212121");
      expect(color.dark.action).toBe("#FFFFFF");
      expect(color.dark["on-action"]).toBe("#000000");
      expect(color.dark["on-surface"]).toBe("#F2F2F2");
    });
  });

  describe("when reading status roles", () => {
    it("exposes success, warning, info, and danger pairs distinct from action", () => {
      expect(colorRoles).toEqual(
        expect.arrayContaining([
          "danger",
          "on-danger",
          "success",
          "on-success",
          "warning",
          "on-warning",
          "info",
          "on-info",
        ]),
      );

      for (const scheme of colorSchemes) {
        expect(color[scheme].danger).not.toBe(color[scheme].action);
        expect(color[scheme].success).not.toBe(color[scheme].action);
        expect(color[scheme].warning).not.toBe(color[scheme].action);
        expect(color[scheme].info).not.toBe(color[scheme].action);
        expect(
          new Set([
            color[scheme].danger,
            color[scheme].success,
            color[scheme].warning,
            color[scheme].info,
          ]).size,
        ).toBe(4);
      }
    });
  });
});
