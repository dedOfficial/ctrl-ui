import type { Meta, StoryObj } from "@storybook/react-vite";
import { typography } from "ctrlds";

import { SchemePair, TokenRow } from "./TokenGallery.tsx";

const meta = {
  title: "Tokens/Typography",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <SchemePair>
      {() => (
        <>
          <TokenRow name="family" value={typography.family} />
          {Object.entries(typography.size).map(([name, value]) => (
            <p
              key={name}
              aria-label={`size ${name} ${value}`}
              style={{
                fontFamily: "var(--font-family)",
                fontSize: `var(--font-size-${name})`,
                fontWeight: "var(--font-weight-regular)",
                lineHeight: `var(--font-line-height-${name})`,
                margin: 0,
              }}
            >
              {`size ${name} ${value}`}
            </p>
          ))}
          {Object.entries(typography.weight).map(([name, value]) => (
            <p
              key={name}
              aria-label={`weight ${name} ${value}`}
              style={{
                fontFamily: "var(--font-family)",
                fontSize: "var(--font-size-md)",
                fontWeight: `var(--font-weight-${name})`,
                margin: 0,
              }}
            >
              {`weight ${name} ${value}`}
            </p>
          ))}
        </>
      )}
    </SchemePair>
  ),
};
