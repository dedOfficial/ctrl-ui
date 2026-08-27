export const direction = {
  ltr: "ltr",
  rtl: "rtl",
} as const;

export type Direction = (typeof direction)[keyof typeof direction];
