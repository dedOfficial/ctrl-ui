# Ctrl UI

Opinionated React + TypeScript design-system kit. The public package name is `ctrlds`. The workspace directory is `packages/ctrl-ui`.

This increment is toolchain + tokens. There are no public atoms. The package is private; npm publish waits for the first atom batch.

## Requirements

- Node `>=22.18.0`
- pnpm 11 via Corepack

## Bootstrap

```sh
corepack enable
pnpm install
pnpm lint
pnpm fmt:check
pnpm typecheck
pnpm test
pnpm catalog
```

`pnpm catalog` starts Storybook. `pnpm catalog:build` builds the catalog for CI.

## Workspace

| Path               | Role                        |
| ------------------ | --------------------------- |
| `packages/ctrl-ui` | Public kit package `ctrlds` |
| `apps/catalog`     | Private Storybook catalog   |

A feature consumer in this workspace installs `ctrlds` with `workspace:*` and applies semantic tokens. Do not clone a special Next.js package; token CSS is an ordinary ESM CSS export (`ctrlds/variables.css`). Clone-free install is `pnpm pack` of `ctrlds` into an app outside this repository; `workspace:*` does not satisfy that proof. See `packages/ctrl-ui/README.md`.
