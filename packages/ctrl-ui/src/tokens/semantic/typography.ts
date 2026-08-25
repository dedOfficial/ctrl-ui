import { typography as primitiveTypography } from "../primitive/typography.ts";

export const typography = {
  family: `${primitiveTypography.familyName}, system-ui, sans-serif`,
  size: {
    sm: `${primitiveTypography.size[14]}px`,
    md: `${primitiveTypography.size[16]}px`,
    lg: `${primitiveTypography.size[20]}px`,
    xl: `${primitiveTypography.size[24]}px`,
  },
  weight: {
    regular: `${primitiveTypography.weight[400]}`,
    medium: `${primitiveTypography.weight[500]}`,
    semibold: `${primitiveTypography.weight[600]}`,
    bold: `${primitiveTypography.weight[700]}`,
  },
  lineHeight: {
    sm: "20px",
    md: "24px",
    lg: "28px",
    xl: "32px",
  },
} as const;
