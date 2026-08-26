import type { Meta, StoryObj } from "@storybook/react-vite";
import { density } from "ctrlds";

import { SchemePair, TokenRow } from "./TokenGallery.tsx";

const meta = {
  title: "Tokens/Density",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <SchemePair>
      {() =>
        Object.entries(density).map(([name, value]) => (
          <TokenRow key={name} name={name} value={String(value)} />
        ))
      }
    </SchemePair>
  ),
};
