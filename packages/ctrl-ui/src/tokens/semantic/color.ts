import { color as primitiveColor } from "../primitive/color.ts";

export const colorSchemes = ["light", "dark"] as const;

export type ColorScheme = (typeof colorSchemes)[number];

export const colorRoles = [
  "surface",
  "on-surface",
  "action",
  "on-action",
  "danger",
  "on-danger",
  "success",
  "on-success",
  "warning",
  "on-warning",
  "info",
  "on-info",
  "focus",
] as const;

export type ColorRole = (typeof colorRoles)[number];

export type SemanticColor = Record<ColorRole, string>;

export const color = {
  light: {
    surface: primitiveColor.neutral[100],
    "on-surface": primitiveColor.neutral[900],
    action: primitiveColor.neutral[900],
    "on-action": primitiveColor.neutral[50],
    danger: primitiveColor.danger[800],
    "on-danger": primitiveColor.neutral[50],
    success: primitiveColor.success[800],
    "on-success": primitiveColor.neutral[50],
    warning: primitiveColor.warning[800],
    "on-warning": primitiveColor.neutral[50],
    info: primitiveColor.info[800],
    "on-info": primitiveColor.neutral[50],
    focus: primitiveColor.neutral[500],
  },
  dark: {
    surface: primitiveColor.neutral[800],
    "on-surface": primitiveColor.neutral[100],
    action: primitiveColor.neutral[50],
    "on-action": primitiveColor.neutral[900],
    danger: primitiveColor.danger[300],
    "on-danger": primitiveColor.neutral[900],
    success: primitiveColor.success[300],
    "on-success": primitiveColor.neutral[900],
    warning: primitiveColor.warning[300],
    "on-warning": primitiveColor.neutral[900],
    info: primitiveColor.info[300],
    "on-info": primitiveColor.neutral[900],
    focus: primitiveColor.neutral[500],
  },
} as const satisfies Record<ColorScheme, SemanticColor>;
