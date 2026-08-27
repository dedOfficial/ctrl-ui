import { space as primitiveSpace } from "../primitive/space.ts";

export const space = {
  xs: `${primitiveSpace[4]}px`,
  sm: `${primitiveSpace[8]}px`,
  md: `${primitiveSpace[16]}px`,
  lg: `${primitiveSpace[24]}px`,
  xl: `${primitiveSpace[32]}px`,
  xxl: `${primitiveSpace[48]}px`,
} as const;

export const targetMinSize = `${primitiveSpace[24]}px`;
