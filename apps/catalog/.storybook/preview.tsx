import type { Decorator, Preview } from "@storybook/react-vite";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "ctrlds/tokens.css";

const withSchemeAndDirection: Decorator = (Story, context) => {
  const scheme = context.globals.scheme as "light" | "dark";
  const direction = context.globals.direction as "ltr" | "rtl";

  return (
    <div data-scheme={scheme} dir={direction}>
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
