import type { Meta, StoryObj } from "@storybook/react-vite";
import { radius } from "ctrlds";

import { SchemePair, TokenRow } from "./TokenGallery.tsx";

const meta = {
  title: "Tokens/Radius",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <SchemePair>
      {() => (
        <>
          {Object.entries(radius).map(([name, value]) => (
            <TokenRow
              key={name}
              name={name}
              value={value}
              swatch={{
                background: "var(--color-action)",
                borderRadius: `var(--radius-${name})`,
              }}
            />
          ))}
        </>
      )}
    </SchemePair>
  ),
};
