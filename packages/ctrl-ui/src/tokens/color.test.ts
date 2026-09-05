import { describe, expect, it } from "vitest";

import * as publicApi from "../index.ts";
import { color as primitiveColor, rampSteps } from "./primitive/color.ts";
import { color, colorRoles, colorSchemes } from "./semantic/color.ts";

const accentSteps = ["A100", "A200", "A400", "A700"];

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
    // Serialising the semantic map alone can never contain a ramp name, so this
    // asserts against the public export surface and against the values it can
    // reach: a leaked ramp shows up as a step no semantic role points at.
    it("reaches no color value that is not a semantic role value", () => {
      const semanticValues = colorSchemes.flatMap((scheme) =>
        colorRoles.map((role) => color[scheme][role]),
      );
      const reachableValues = JSON.stringify(publicApi).match(/#[0-9A-Fa-f]{6}/g) ?? [];

      expect(reachableValues.length).toBeGreaterThan(0);
      for (const value of reachableValues) {
        expect(semanticValues).toContain(value);
      }
    });

    it("keeps primitive ramp families off the public export surface", () => {
      for (const family of Object.keys(primitiveColor)) {
        expect(publicApi).not.toHaveProperty(family);
      }
    });

    it("requires no accent A100-A700 step on any ramp", () => {
      for (const ramp of Object.values(primitiveColor)) {
        for (const step of accentSteps) {
          expect(ramp).not.toHaveProperty(step);
        }
      }
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
