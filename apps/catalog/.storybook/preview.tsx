import type { Decorator, Preview } from "@storybook/react-vite";
import { color, direction } from "ctrlds";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "ctrlds/tokens.css";

type Scheme = keyof typeof color;
type Direction = (typeof direction)[keyof typeof direction];

const withSchemeAndDirection: Decorator = (Story, context) => {
  const scheme = context.globals.scheme as Scheme;
  const writingDirection = context.globals.direction as Direction;

  return (
    <div data-scheme={scheme} dir={writingDirection}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    scheme: {
      description: "Color scheme",
      toolbar: {
        title: "Scheme",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Writing direction",
      toolbar: {
        title: "Direction",
        items: [
          { value: "ltr", title: "LTR" },
          { value: "rtl", title: "RTL" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    scheme: "light",
    direction: "ltr",
  },
  decorators: [withSchemeAndDirection],
  parameters: {
    a11y: {
      test: "error",
    },
  },
};

export default preview;
