import { describe, expect, it } from "vitest";

import { color, colorRoles, colorSchemes } from "./semantic/color.ts";
import { focusRing } from "./semantic/focus.ts";

const AA_CONTRAST = 4.5;
const NON_TEXT_CONTRAST = 3;

function hexToRgb(hex: string): readonly [number, number, number] {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function linearChannel(channel: number): number {
  const srgb = channel / 255;
  if (srgb <= 0.04045) {
    return srgb / 12.92;
  }
  return ((srgb + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex);
  return 0.2126 * linearChannel(red) + 0.7152 * linearChannel(green) + 0.0722 * linearChannel(blue);
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

const paintedPairs = [
  ["surface", "on-surface"],
  ["action", "on-action"],
  ["danger", "on-danger"],
  ["success", "on-success"],
  ["warning", "on-warning"],
  ["info", "on-info"],
] as const;

describe("contrast", () => {
  describe("when a semantic pair is painted", () => {
    it("meets WCAG 2.2 AA contrast on every foreground and background pair", () => {
      for (const scheme of colorSchemes) {
        for (const [backgroundRole, foregroundRole] of paintedPairs) {
          const ratio = contrastRatio(color[scheme][backgroundRole], color[scheme][foregroundRole]);
          expect(ratio, `${scheme} ${foregroundRole} on ${backgroundRole}`).toBeGreaterThanOrEqual(
            AA_CONTRAST,
          );
        }
      }
    });
  });

  describe("when a focus ring is drawn", () => {
    it("meets 3:1 non-text contrast on surface and action in both schemes", () => {
      expect(focusRing.width).toBe("2px");
      expect(focusRing.offset).toBe("2px");
      expect(colorRoles).toContain("focus");

      for (const scheme of colorSchemes) {
        const focusColor = color[scheme].focus;
        expect(contrastRatio(focusColor, color[scheme].surface)).toBeGreaterThanOrEqual(
          NON_TEXT_CONTRAST,
        );
        expect(contrastRatio(focusColor, color[scheme].action)).toBeGreaterThanOrEqual(
          NON_TEXT_CONTRAST,
        );
      }
    });
  });
});
