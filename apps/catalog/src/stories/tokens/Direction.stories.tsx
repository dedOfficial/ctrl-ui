import type { Meta, StoryObj } from "@storybook/react-vite";
import { direction } from "ctrlds";

import { SchemePair, TokenRow } from "./TokenGallery.tsx";

const meta = {
  title: "Tokens/Direction",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <SchemePair>
      {() =>
        Object.entries(direction).map(([name, value]) => (
          <div key={name} dir={value}>
            <TokenRow name={name} value={value} />
            <p
              data-ctrl-logical-space
              aria-label={`${value} logical inset`}
              style={{
                background: "var(--color-action)",
                color: "var(--color-on-action)",
                fontFamily: "var(--font-family)",
              }}
            >
              {`${value} logical inset`}
            </p>
          </div>
        ))
      }
    </SchemePair>
  ),
};
