import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { color, colorRoles } from "./semantic/color.ts";
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

function declarationBlock({
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

// Alias families resolve through var() so a consumer overriding the source token
// (for example --space-md) moves every alias with it.
function aliasDeclarations({
  prefix,
  source,
  tokens,
}: {
  prefix: string;
  source: string;
  tokens: Record<string, string | number>;
}): Array<readonly [string, string]> {
  return Object.keys(tokens).map(
    (name) => [`--${prefix}-${name}`, `var(--${source}-${name})`] as const,
  );
}

function sharedDeclarations(): Array<readonly [string, string]> {
  return [
    ...tokenDeclarations({ prefix: "space", tokens: space }),
    ...aliasDeclarations({ prefix: "space-inline", source: "space", tokens: space }),
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
    ...aliasDeclarations({ prefix: "inset-inline", source: "space", tokens: space }),
    ...aliasDeclarations({ prefix: "inset-block", source: "space", tokens: space }),
  ];
}

function colorDeclarations(scheme: "light" | "dark"): Array<readonly [string, string]> {
  return [
    // Keeps user-agent surfaces (scrollbars, form controls, canvas) on the active scheme.
    ["color-scheme", scheme],
    ...colorRoles.map((role) => [`--color-${role}`, color[scheme][role]] as const),
  ];
}

export function generateCss(): string {
  const lightBlock = declarationBlock({
    selector: ":root, [data-scheme='light']",
    declarations: colorDeclarations("light"),
  });

  const darkBlock = declarationBlock({
    selector: "[data-scheme='dark']",
    declarations: colorDeclarations("dark"),
  });

  const sharedBlock = declarationBlock({
    selector: ":root, [data-scheme]",
    declarations: sharedDeclarations(),
  });

  const ltrBlock = declarationBlock({
    selector: ":root, [dir='ltr']",
    declarations: [["--direction", direction.ltr]],
  });

  const rtlBlock = declarationBlock({
    selector: "[dir='rtl']",
    declarations: [["--direction", direction.rtl]],
  });

  const reducedMotionBlock = `@media ${motion.reducedMotionQuery} {\n${declarationBlock({
    selector: ":root, [data-scheme]",
    declarations: [["--motion-duration", motion.reducedDuration]],
  })}\n}`;

  return [
    "/* Generated from packages/ctrl-ui/src/tokens/css.ts. Do not edit by hand. */",
    "",
    lightBlock,
    darkBlock,
    "",
    sharedBlock,
    "",
    ltrBlock,
    rtlBlock,
    "",
    reducedMotionBlock,
    "",
  ].join("\n");
}

export function writeGeneratedCss({ outputPath }: { outputPath: string }): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, generateCss(), "utf8");
}
