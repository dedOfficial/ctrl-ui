# ctrlds

Ctrl UI is an opinionated React + TypeScript design-system kit. This workspace package is named `ctrlds`.

`@fontsource/inter` is not a kit runtime dependency. The catalog loads Inter for weights 400, 500, 600, and 700. A consumer that wants Inter on screen MUST install and load those files itself.

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

`workspace:*` is for this repository. It does not satisfy clone-free install.

Peer range: `react` and `react-dom` `^18.0.0 || ^19.0.0`.

## Install (tarball)

Pack the built kit and install it outside this git workspace:

```sh
pnpm --filter ctrlds build
pnpm --filter ctrlds pack
```

Then, in a throwaway app that is not this repository:

```sh
pnpm add /path/to/ctrlds-0.0.0.tgz
```

```ts
import "ctrlds/variables.css";
import { color, space, typography } from "ctrlds";
```

## Tokens

Import the generated CSS variables, then read semantic collections. Primitive steps are private.

```ts
import "ctrlds/variables.css";
import { color, space, typography } from "ctrlds";
```

Apply a scheme with `data-scheme="light"` or `data-scheme="dark"` on a root node. Light values also apply on `:root`. Apply writing direction with `dir="ltr"` or `dir="rtl"`.

Public collections: `color`, `space`, `typography`, `radius`, `density`, `direction`.
