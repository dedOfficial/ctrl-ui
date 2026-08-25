import { color } from "../semantic/color.ts";
import { density } from "../semantic/density.ts";
import { direction } from "../semantic/direction.ts";
import { radius } from "../semantic/radius.ts";
import { space } from "../semantic/space.ts";
import { typography } from "../semantic/typography.ts";

export const component = {
  color,
  density,
  direction,
  radius,
  space,
  typography,
} as const;
