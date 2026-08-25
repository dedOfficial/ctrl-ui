export const rampSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type RampStep = (typeof rampSteps)[number];

export type ColorRamp = Record<RampStep, string>;

export const color = {
  neutral: {
    50: "#FFFFFF",
    100: "#F2F2F2",
    200: "#E0E0E0",
    300: "#BDBDBD",
    400: "#9E9E9E",
    500: "#757575",
    600: "#616161",
    700: "#424242",
    800: "#212121",
    900: "#000000",
  },
  danger: {
    50: "#FBEAEA",
    100: "#F4D2D2",
    200: "#E8A6A6",
    300: "#D97A7A",
    400: "#C95454",
    500: "#B33A3A",
    600: "#9A2C2C",
    700: "#7C2222",
    800: "#5E1A1A",
    900: "#3F1111",
  },
  success: {
    50: "#E8F5EE",
    100: "#C6E6D4",
    200: "#8FCBAB",
    300: "#56B080",
    400: "#2F9460",
    500: "#1F7A4C",
    600: "#18613C",
    700: "#124A2E",
    800: "#0C3320",
    900: "#071F13",
  },
  warning: {
    50: "#FBF3E4",
    100: "#F5E1B8",
    200: "#EBC575",
    300: "#D9A63A",
    400: "#C48912",
    500: "#A6710A",
    600: "#845A08",
    700: "#634406",
    800: "#432E04",
    900: "#2A1C02",
  },
  info: {
    50: "#E7F1FA",
    100: "#C4DCF2",
    200: "#8BB8E0",
    300: "#5293CD",
    400: "#2B74B5",
    500: "#1B5C96",
    600: "#154876",
    700: "#103758",
    800: "#0B253C",
    900: "#071828",
  },
} as const satisfies Record<string, ColorRamp>;
