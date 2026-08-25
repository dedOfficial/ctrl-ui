# ctrlds

Ctrl UI is an opinionated React + TypeScript design-system kit. This workspace package is named `ctrlds`.

## Install (workspace)

This increment ships as a private workspace package. Do not publish it to npm yet.

From the repository root, with Node `>=22.18.0` and Corepack:

```sh
corepack enable
pnpm install
```

Add the workspace package to a consuming app in this repository:

```json
{
  "dependencies": {
    "ctrlds": "workspace:*"
  }
}
```

Peer range: `react` and `react-dom` `^18.0.0 || ^19.0.0`.

## Tokens

Import the generated CSS variables, then read semantic collections. Primitive steps are private.

```ts
import "ctrlds/tokens.css";
import { color, space, typography } from "ctrlds";
```

Apply a scheme with `data-scheme="light"` or `data-scheme="dark"` on a root node. Apply writing direction with `dir="ltr"` or `dir="rtl"`.

Public collections: `color`, `space`, `typography`, `radius`, `density`, `direction`.
