import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { color, colorRoles, colorSchemes } from "./semantic/color.ts";
import { density } from "./semantic/density.ts";
import { direction } from "./semantic/direction.ts";
import { focusRing } from "./semantic/focus.ts";
import { motion } from "./semantic/motion.ts";
import { radius } from "./semantic/radius.ts";
import { space, targetMinSize } from "./semantic/space.ts";
import { typography } from "./semantic/typography.ts";

const moduleDirectory = dirname(fileURLToPath(import.meta.url));

export const generatedCssPath = join(moduleDirectory, "generated", "variables.css");

function declarationLines(declarations: ReadonlyArray<readonly [string, string]>): string {
  return declarations.map(([name, value]) => `  ${name}: ${value};`).join("\n");
}

function customPropertyBlock({
  selector,
  declarations,
}: {
  selector: string;
  declarations: ReadonlyArray<readonly [string, string]>;
}): string {
  return `${selector} {\n${declarationLines(declarations)}\n}`;
}

function tokenDeclarations({
  prefix,
  tokens,
}: {
  prefix: string;
  tokens: Record<string, string | number>;
}): Array<readonly [string, string]> {
  return Object.entries(tokens).map(
    ([name, value]) => [`--${prefix}-${name}`, String(value)] as const,
  );
}

function sharedDeclarations(): Array<readonly [string, string]> {
  return [
    ...tokenDeclarations({ prefix: "space", tokens: space }),
    ["--target-min-size", targetMinSize],
    ...tokenDeclarations({ prefix: "radius", tokens: radius }),
    ["--font-family", typography.family],
    ...tokenDeclarations({ prefix: "font-size", tokens: typography.size }),
    ...tokenDeclarations({ prefix: "font-weight", tokens: typography.weight }),
    ...tokenDeclarations({ prefix: "font-line-height", tokens: typography.lineHeight }),
    ...tokenDeclarations({ prefix: "density", tokens: density }),
    ["--focus-ring-width", focusRing.width],
    ["--focus-ring-offset", focusRing.offset],
    ["--motion-duration", motion.duration],
  ];
}

function colorDeclarations(
  scheme: (typeof colorSchemes)[number],
): Array<readonly [string, string]> {
  const roles = color[scheme];
  return colorRoles.map((role) => [`--color-${role}`, roles[role]] as const);
}

export function generateCss(): string {
  const schemeBlocks = colorSchemes.map((scheme) =>
    customPropertyBlock({
      selector: `[data-scheme='${scheme}']`,
      declarations: colorDeclarations(scheme),
    }),
  );

  const sharedBlock = customPropertyBlock({
    selector: "[data-scheme]",
    declarations: sharedDeclarations(),
  });

  const directionBlocks = Object.values(direction).map((value) =>
    customPropertyBlock({
      selector: `[dir='${value}']`,
      declarations: [["--direction", value]],
    }),
  );

  const logicalSpaceBlock = customPropertyBlock({
    selector: "[data-ctrl-logical-space]",
    declarations: [
      ["margin-inline", "var(--space-sm)"],
      ["padding-inline", "var(--space-md)"],
      ["inset-inline", "auto"],
    ],
  });

  const reducedMotionBlock = `@media ${motion.reducedMotionQuery} {\n${customPropertyBlock({
    selector: ":root",
    declarations: [["--motion-duration", motion.reducedDuration]],
  })}\n}`;

  return [
    "/* Generated from packages/ctrl-ui/src/tokens/css.ts. Do not edit by hand. */",
    "",
    ...schemeBlocks,
    "",
    sharedBlock,
    "",
    ...directionBlocks,
    "",
    logicalSpaceBlock,
    "",
    reducedMotionBlock,
    "",
  ].join("\n");
}

export function writeGeneratedCss({ outputPath }: { outputPath: string }): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, generateCss(), "utf8");
}
