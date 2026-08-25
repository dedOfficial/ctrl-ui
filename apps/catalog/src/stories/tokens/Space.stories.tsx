import type { Meta, StoryObj } from "@storybook/react-vite";
import { space } from "ctrlds";

import { SchemePair, TokenRow } from "./TokenGallery.tsx";

const meta = {
  title: "Tokens/Space",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <SchemePair>
      {() => (
        <>
          {Object.entries(space).map(([name, value]) => (
            <TokenRow
              key={name}
              name={name}
              value={value}
              swatch={{
                width: value,
                height: "var(--space-sm)",
                background: "var(--color-action)",
              }}
            />
          ))}
        </>
      )}
    </SchemePair>
  ),
};
