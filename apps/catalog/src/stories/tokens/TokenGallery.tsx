/*
 * TokenRow marks each row role="group" so it can carry an accessible name;
 * aria-label is ARIA-prohibited on the default generic role. None of the native
 * tags this rule suggests (address, details, fieldset, hgroup, optgroup)
 * describes a token row.
 */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import type { CSSProperties, ReactNode } from "react";
import { color } from "ctrlds";

export type Scheme = keyof typeof color;

export function SchemePair({ children }: { children: (scheme: Scheme) => ReactNode }): ReactNode {
  return (
    <>
      <p
        style={{
          background: "var(--color-surface)",
          color: "var(--color-on-surface)",
          fontFamily: "var(--font-family)",
          fontSize: "var(--font-size-md)",
          padding: "var(--space-sm)",
          marginBlockEnd: "var(--space-md)",
        }}
      >
        Toolbar scheme sample
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "var(--space-lg)",
        }}
      >
        {(Object.keys(color) as Scheme[]).map((scheme) => (
          <section
            key={scheme}
            data-scheme={scheme}
            aria-label={`${scheme} scheme`}
            style={{
              background: "var(--color-surface)",
              color: "var(--color-on-surface)",
              padding: "var(--space-lg)",
              borderRadius: "var(--radius-md)",
              minWidth: 0,
            }}
          >
            <h2 style={{ fontFamily: "var(--font-family)", fontSize: "var(--font-size-lg)" }}>
              {scheme}
            </h2>
            {children(scheme)}
          </section>
        ))}
      </div>
    </>
  );
}

export function TokenRow({
  name,
  value,
  swatch,
  swatchContent,
}: {
  name: string;
  value: string;
  swatch?: CSSProperties;
  swatchContent?: ReactNode;
}): ReactNode {
  return (
    <div
      role="group"
      aria-label={`${name} ${value}`}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(8rem, 12rem) minmax(3rem, 3rem) minmax(0, 1fr)",
        gap: "var(--space-sm)",
        alignItems: "center",
        minHeight: "var(--target-min-size)",
      }}
    >
      <code>{name}</code>
      {swatch ? (
        // Decorative: the row already announces the token name and value.
        <span
          aria-hidden="true"
          style={{
            width: "var(--target-min-size)",
            height: "var(--target-min-size)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "0 0 0 1px var(--color-on-surface)",
            ...swatch,
          }}
        >
          {swatchContent}
        </span>
      ) : (
        <span />
      )}
      <span>{value}</span>
    </div>
  );
}
