import { radius as primitiveRadius } from "../primitive/radius.ts";

export const radius = {
  sm: `${primitiveRadius[8]}px`,
  md: `${primitiveRadius[12]}px`,
  lg: `${primitiveRadius[16]}px`,
  full: `${primitiveRadius.pill}px`,
} as const;
