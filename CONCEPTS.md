# Concepts

> Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

## Tokens

### Primitive token

A private stepped scale value (one hue family, one space step, one type size). Consumers and UI modules MUST NOT read primitives; they exist so semantic roles can point at a step.

### Semantic token

A named public role a consumer or UI module may use — `surface`, `action`, `xxl`, and peers. Each semantic token points at a primitive step. Visual values in UI MUST come from semantic or component tokens, not literals.

### Component token

The third token tier: token context for a specific UI module (button fill, table row gap). It is not a React “component.” UI modules are atoms, molecules, organisms, and templates.

_Avoid:_ calling UI modules “components” when the component-token tier is in scope.

### Scheme

Light or dark color mapping for the same semantic roles. Light values apply on `:root` and on `[data-scheme='light']`; dark values apply on `[data-scheme='dark']` at any element. Nested scheme islands still receive shared non-color tokens on `:root, [data-scheme]`.

### Token CSS public contract

The generated CSS custom-property dump plus the kit `exports` map that exposes it as `ctrlds/variables.css`. Consumers apply tokens by importing that CSS, then reading TypeScript collections. A parallel export name, scheme-only selectors, or `margin-inline` utilities in the dump are not this contract.

### Direction token

`--direction` is an inspection mirror (`ltr` or `rtl`) on `:root` / `[dir]`. It MUST NOT flip layout. Writing direction is switched only by the HTML `dir` attribute.

## Product

### ctrlds

The public kit package name. The workspace directory is `packages/ctrl-ui`. Until the first atom batch it is a private workspace package; clone-free install is proven by packing a tarball, not by catalog `workspace:*`.

### Catalog

The private Storybook app that galleries public token collections. It is not shipped in the kit tarball. Inter font files are a catalog (and host) dependency, not a `ctrlds` runtime dependency.

## Flagged ambiguities

- “component” had been easy to read as a React UI module — in token context it means the third token tier; UI modules are atoms, molecules, organisms, and templates.
- “tokens.css” had been used as the CSS export path — the public export is `ctrlds/variables.css`.
