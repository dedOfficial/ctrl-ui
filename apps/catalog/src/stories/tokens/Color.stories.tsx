import type { Meta, StoryObj } from "@storybook/react-vite";
import { color } from "ctrlds";

import { SchemePair, TokenRow } from "./TokenGallery.tsx";

const paintedPairs = [
  ["surface", "on-surface"],
  ["action", "on-action"],
  ["danger", "on-danger"],
  ["success", "on-success"],
  ["warning", "on-warning"],
  ["info", "on-info"],
] as const;

const meta = {
  title: "Tokens/Color",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <SchemePair>
      {(scheme) => {
        const roles = color[scheme];
        return (
          <>
            {Object.entries(roles).map(([name, value]) => (
              <TokenRow
                key={name}
                name={name}
                value={value}
                swatch={{ background: `var(--color-${name})` }}
              />
            ))}
            <h3 style={{ fontFamily: "var(--font-family)", fontSize: "var(--font-size-md)" }}>
              Painted pairs
            </h3>
            {paintedPairs.map(([background, foreground]) => (
              <TokenRow
                key={`${background}-${foreground}`}
                name={`foreground ${foreground} on background ${background}`}
                value={`${roles[foreground]} on ${roles[background]}`}
                swatch={{
                  background: `var(--color-${background})`,
                  color: `var(--color-${foreground})`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: "var(--font-size-sm)",
                  width: "auto",
                  minWidth: "var(--target-min-size)",
                  paddingInline: "var(--space-xs)",
                }}
              />
            ))}
          </>
        );
      }}
    </SchemePair>
  ),
};
