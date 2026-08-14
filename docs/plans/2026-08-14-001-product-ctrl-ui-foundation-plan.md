---
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
title: Ctrl UI Foundation - Plan
date: 2026-08-14
status: requirements-only
---

# Ctrl UI Foundation - Plan

## Goal Capsule

**Objective.** Lock the product frame and infrastructure contract for Ctrl UI: a public React + TypeScript UI kit that grows through Atomic Design from tokens to complex compositions, is accessible out of the box, and gives consumers predictable customization without dissolving the system.

**Product authority.** This document is the requirements source until `ce-plan`. The `dedOfficial/ctrl-ui` repository is currently empty (MIT, Compound Engineering config example). Code, package schemas, and exact configs are out of this document.

**Open blockers.** Nothing blocks planning of infrastructure and the token/atom layer. Visual brand and the first consuming app are unset — they do not block the foundation, but they keep the starting palette to a neutral shipped theme.

## How This Work Fits Together

One work unit: the **Ctrl UI foundation**. Infrastructure and the design system are not split into separate contracts — a package without a layer model is meaningless, and layers without a toolchain cannot be honestly gated (a11y, lint, versioning).

Delivery order inside this unit:

1. Toolchain and git discipline (so every later layer already lives behind the right gates).
2. Sub-atoms: tokens and the CSS-variable contract.
3. Atoms with the a11y contract.
4. Molecules.
5. Organisms (modal, table, and similar).
6. Templates / layout shells.

Items 4–6 continue the same product; they are not separate products. Implementation planning may slice them into units, but it must not change layer, a11y, or customization rules.

## Product Contract

### Primary actors

- **Kit author** — develops Ctrl UI in this repository.
- **Feature consumer** — a product team that installs the package and builds screens. Must not have to assemble keyboard navigation, focus traps, and ARIA for shipped components.

### Positioning

Ctrl UI is an **opinionated design-system kit**, not a headless set and not a copy-paste catalog like shadcn. The consumer gets a finished visual language and accessible behavior. Customization goes through tokens, a closed variant set, and composition — not through unbounded style props.

Adjacent product shapes we are not building:

- Headless-only (Radix/React Aria as the product) — maximum freedom, no system.
- Utility-first kit with Tailwind as the public API — consumers bypass tokens.
- Source-copy kit — breaks Conventional Commits / semver as the delivery contract.

### Core outcome

A consumer can assemble an accessible screen from Ctrl UI, restyle it through semantic tokens, and cannot break a11y or visual hierarchy with a one-off prop.

### Language (repo artifacts)

All documents, plans, READMEs, Storybook docs, JSDoc, inline comments, commit messages, and pull request text in this repository are **English only**. Chat with humans may use another language; committed work must not. Standing instruction for agents: `AGENTS.md` and the single-responsibility files in `.cursor/rules/`.

### In scope

- Infrastructure contract: package manager, library build, docs/catalog, lint/format, git hooks, conventional commits, versioning.
- Atomic Design as the primary architecture, followed strictly, with **downward-only** dependencies: tokens → atoms → molecules → organisms → templates.
- Three-tier tokens: primitive → semantic → component.
- WCAG 2.2 AA as the floor for every public component.
- Customization contract (below).
- Full Storybook coverage of every public export (tokens, atoms, molecules, organisms, templates).
- Vitest with a strict 100% coverage gate in every category (statements, branches, functions, lines), per file.
- English-only committed prose (documents and comments).
- RFC 2119 keyword language in every future implementation plan.

### Out of scope (this foundation)

- Native iOS/Android kit.
- A Figma library as a required first-delivery artifact.
- Marketing site, changelog portal, paid product.
- Copying another visual language (MUI, Chakra, shadcn).
- An App Router / Next-specific framework kit as a separate package — the kit must work in ordinary React. RSC compatibility (`"use client"` where needed) is a consumer requirement, not a separate product.
- Organisms/templates in the first code delivery — they are on the product trajectory, not in the first implementation slice.

### Customization vs strictness

Customization is allowed only through four channels, in this priority:

1. **Semantic tokens / theme** — the primary channel (role color, density, radius, typography, light/dark scheme).
2. **Closed variant props** (`intent`, `size`, `appearance`) — finite enums, not free-form style strings.
3. **Composition** — compound components and slots for structure, not for replacing semantics.
4. **Escape hatch** — `className` / slot class on documented nodes, last resort.

Forbidden as public API:

- Props such as `backgroundColor`, `sx`, or an arbitrary CSS-in-JS theme object as the main path.
- Turning off semantics and keyboard behavior “to make styling easier”.
- Direct use of primitive tokens in components and by consumers (semantic / component only).

Kit-author strictness:

- A component contains no literal colors, spacing, or type values outside the token pipeline.
- A one-off visual prop is not added; add a token or a variant first.
- Atomic Design layers do not import upward.

### Accessibility floor

Every public component:

- Meets WCAG 2.2 AA, including Target Size 2.5.8 (minimum 24×24 CSS px) and Focus Not Obscured 2.4.12.
- Keyboard: Tab/Arrow/Enter/Space/Escape per APG for that pattern.
- Has a visible `:focus-visible` indicator.
- Icon-only controls have an accessible name.
- Form errors are announced with `role="alert"` / `aria-live`, not color alone.
- Modals: focus trap, focus return, `Escape`.
- Automated a11y checks in the catalog and in tests are required; a manual keyboard pass is part of Definition of Done for overlay and composite widgets.

A consumer may **add** ARIA, but cannot strip the contract the kit owns.

### Quality toolchain (product constraints)

These decisions are product constraints because this brainstorm is about stack. Config details belong in `ce-plan`.

| Concern | Decision | Why |
| --- | --- | --- |
| Language | React + TypeScript, `strict` | session-settled |
| Package manager | **pnpm** + Corepack | kit/workspace default; predictable lockfile invariants |
| Repo shape | **pnpm workspace with two surfaces**: public kit package and internal catalog/docs app | catalog must not ship in the npm artifact; full Turborepo on day one is extra ceremony |
| Library bundler | **tsdown** (Rolldown, ESM-first, dts) | tsup successor; Vite stays for the catalog, not for publish |
| Catalog | **Storybook on Vite; every public export has CSF3 stories** | session-settled “fully storybooked” |
| Tests | **Vitest + Testing Library + axe** | oxlint has Vitest rules; Jest is unnecessary |
| Coverage | **100% statements, branches, functions, lines; `perFile: true`** | session-settled; Vitest `coverage.thresholds['100']`; istanbul recommended |
| Lint | **oxlint only** for JS/TS/TSX | session-settled; ESLint is not introduced |
| Format | **oxfmt**, not Prettier and not oxlint | oxlint is not a formatter; oxfmt is the Prettier-compatible Oxc replacement |
| CSS lint | **no Stylelint at foundation** | oxlint does not lint CSS; keep Stylelint YAGNI by shrinking the CSS surface (see investigation below) |
| Git hooks | **Lefthook** | one runner: staged oxlint/oxfmt + commit-msg |
| Commits | **Conventional Commits** via commitlint | session-settled |
| Versioning | **Changesets** + semver | library changelog quality beats auto-bump from commit type; conventional commits remain history discipline |
| Node | **Node 22** (Active/LTS at plan time) | |
| Package module | **ESM-only** | CJS dual-publish only if a real consumer is blocked |
| Styles | Tokens → CSS custom properties; component styles live in TypeScript, not a large SCSS codebase | so oxlint covers style code and oxfmt formats the rare CSS dump |
| Repo language | **English only** for documents and comments | session-settled |

### Test descriptions

Proven convention locked for this repo (Vitest testing-in-practice: titles describe behavior and read as a spec; BDD `describe` grouping; drop the redundant `should` prefix):

```ts
describe('Button', () => {
  describe('when loading is true', () => {
    it('exposes a busy state and ignores press', () => {});
  });
});
```

Use `describe` + `it`. Name the unit, then the condition, then the observable outcome. One behavior per `it`. Arrange–Act–Assert in the body. Colocate `*.test.tsx` with source.

### Storybook completeness

Every public export is catalogued. Story titles follow Atomic Design (`Atoms/Button`, `Tokens/Color`). Required stories: Default, each public variant, each meaningful public state. Autodocs and a11y addon are on.

### Implementation-plan language

`ce-plan` and any later implementation plan MUST interpret and write requirements with RFC 2119 keywords (MUST / MUST NOT / SHOULD / MAY, and equivalents). The RFC 2119 key-words sentence MUST appear near the top of that plan.

### Oxlint / Prettier / Stylelint investigation

Facts as of August 2026 (Oxc docs + compatibility matrix):

- **Oxlint** is a JS/TS/JSX/TSX linter (plus script blocks in Vue/Svelte/Astro). It replaces ESLint. CSS/SCSS/HTML/Markdown are **out of linting scope**.
- **Oxfmt** is a separate formatter in the same line. It formats JS/TS and also CSS, SCSS, Less, JSON, YAML, Markdown, HTML, and more. It replaces Prettier; it is not part of oxlint.
- **Stylelint** is not replaced by oxlint. Oxfmt covers CSS *formatting*, not CSS *quality rules* (unknown properties, specificity discipline, bans on literals).

Consequence for Ctrl UI:

1. Do not add Prettier — use **oxfmt**.
2. Do not add ESLint — use **oxlint** (including jsx-a11y / React rules oxlint already ships).
3. Do not add Stylelint until there is a hand-written CSS codebase. Tokens compile to CSS variables; components are styled so most style code is TypeScript. If substantial hand-written CSS appears later — then a narrow Stylelint, not “just in case”.

### Requirements

- **R1.** A kit author can clone the repository, enable Corepack, and get hooks, lint, format, typecheck, test, and catalog from one dependency install.
- **R2.** A commit with a non-conventional message is rejected locally (commit-msg hook) and in CI.
- **R3.** Staged JS/TS passes oxlint and oxfmt before it enters git; CI repeats the full check.
- **R4.** The public package does not contain catalog, tests, or toolchain configs as runtime dependencies.
- **R5.** Tokens are the only source of visual decisions. Primitives do not leak into the component API.
- **R6.** Atomic Design is the primary architecture and is followed strictly. Every public module lives in exactly one layer. Layers depend only downward. A layer violation is a defect and MUST NOT merge.
- **R7.** Every public component has: a TypeScript prop contract, CSF3 stories for Default, each public variant, and each meaningful public state, plus an a11y check.
- **R8.** Theme switches without forking components (semantic layer / CSS variables).
- **R9.** A feature consumer customizes appearance only through channels 1–4 above. Breaking semantics through the public API is impossible or rejected by types.
- **R10.** Overlay and composite widgets (when they exist) ship their own focus management and keyboard behavior.
- **R11.** Package version and changelog are driven by Changesets; a public API breaking change is a major.
- **R12.** Component docs describe: purpose, variants, tokens, and what must not be overridden.
- **R13.** All committed documents and code comments are English.
- **R14.** Kit source MUST meet Vitest coverage of 100% statements, branches, functions, and lines, globally and per file. CI MUST fail otherwise.
- **R15.** Every public export MUST have Storybook stories. A public component without stories MUST NOT merge.
- **R16.** Test titles MUST follow the specification-style convention in `.cursor/rules/tests.mdc` (`describe` + `it`, no “should” prefix, behavior not implementation).
- **R17.** Every implementation plan MUST use RFC 2119 keywords and include the RFC 2119 key-words sentence.

### Primary flows

1. **Bootstrap.** Author installs dependencies → hooks are active → `lint` / `fmt:check` / `typecheck` / `test` / `catalog` work on the empty skeleton.
2. **Add a token.** Author adds a primitive and a semantic mapping → CSS variables update → no component is edited by hand to change a color role.
3. **Add an atom.** Author builds the component on tokens → story + a11y test → changeset → conventional commit. The consumer sees closed variants and theme, not internal primitives.
4. **Theme a product.** Consumer installs the package, sets semantic tokens (or picks a shipped theme), and builds a screen. Focus/keyboard work with no extra code.
5. **Release.** Changeset on the PR → CI green → version bump + changelog → publish the ESM package.

### Acceptance examples

- A consumer changes `--color-action-primary` (or the equivalent semantic token) — all primary buttons, action links, and matching states follow it. Component source is untouched.
- An icon-only `Button` without an accessible name fails the a11y test and/or a type-level ban.
- `className` on the root changes the outer wrapper but does not remove `role`, the focus-ring contract, or the keyboard handler.
- Commit `fixed button` is rejected; `fix(button): restore focus ring on dark theme` is accepted.
- The published tarball does not contain `apps/catalog` or toolchain `node_modules`.
- A new plan, comment, or JSDoc committed in a non-English language is rejected in review (and later by lint/CI if such a gate exists).
- CI fails if any kit source file is below 100% statements, branches, functions, or lines.
- A new public `Button` variant without a story and without an `it('…')` for that state cannot merge.

### Non-goals

- A universal CSS framework.
- Vue / Svelte / React Native support in this product.
- A pixel-perfect copy of an existing library.
- “Any customization at any cost”.

### Key decisions

- **D1.** React + TypeScript. `session-settled: user-stated`
- **D2.** Atomic Design is the primary architecture and MUST be followed strictly (tokens → atoms → molecules → organisms → templates; sub-atoms = tokens). `session-settled: user-stated`
- **D3.** Conventional Commits + git hooks. `session-settled: user-stated`
- **D4.** ESLint is not used; JS/TS lint = oxlint. `session-settled: user-stated`
- **D5.** Prettier is not used; format = oxfmt (not oxlint). `session-settled: investigated-from-user-intent`
- **D6.** Stylelint is not introduced at foundation; CSS surface is deliberately small. Revisit if hand-written CSS appears. `session-settled: investigated-from-user-intent`
- **D7.** The product is an opinionated kit, not headless and not copy-paste. `recommended default`
- **D8.** Customization: tokens → variants → composition → className last resort. `recommended default`
- **D9.** pnpm + tsdown + Storybook/Vite + Vitest + Lefthook + commitlint + Changesets. `recommended default`
- **D10.** ESM-only, Node 22, React as peer. `recommended default`
- **D11.** WCAG 2.2 AA is the floor, not a later goal. `session-settled: user-stated` (AA level is the recommended default)
- **D12.** Overlay/composite behavior is not written from scratch when a proven a11y primitive exists; the visual layer still belongs to Ctrl UI. Primitive library choice is `ce-plan`. `recommended default`
- **D13.** All repository documents and implementation comments are English only. `session-settled: user-stated`
- **D14.** Vitest with strict 100% coverage in all four categories, per file. Istanbul is the recommended provider. `session-settled: user-stated`
- **D15.** The kit is fully Storybooked: every public export has CSF3 stories, including tokens. `session-settled: user-stated`
- **D16.** Test descriptions use specification-style `describe`/`it` titles (Vitest testing-in-practice + BDD grouping; no “should” prefix). `session-settled: investigated-from-user-intent`
- **D17.** Future implementation plans use RFC 2119 requirement keywords. `session-settled: user-stated`
- **D18.** Standing agent rules are single-responsibility files in `.cursor/rules/` (product shape, layers, tokens, customization, accessibility, toolchain, tests, Storybook, implementation plans, English). `session-settled: user-stated`

### Assumptions

- **A1.** The repository is public MIT; the kit is intended for npm under a name derived from `ctrl-ui`. Exact scope (`ctrl-ui` vs `@ctrl-ui/react`) is confirmed at first publish.
- **A2.** There is no first consuming app yet — the starting theme is neutral, not a specific product brand.
- **A3.** Storybook is enough documentation catalog; a marketing docs site is not needed in the foundation.
- **A4.** i18n (RTL, string defaults) is considered in the API (do not hardcode English as required visible text without override); a full localization platform is not built now.
- **A5.** Visual regression (screenshot tests) is desirable later; foundation is a11y + unit + story states.
- **A6.** The brainstorm ran in a non-interactive Cloud Agent mode: product forks the user did not lock are recorded as recommended defaults, not as silently “already agreed”.

### Outstanding questions

- **Q1.** Is npm publish part of the first implementation slice, or is a private/workspace package enough?
- **Q2.** Is there a visual-language reference (existing product, palettes, density)?
- **Q3.** Is dark theme in the first token drop, or only the contract for it?
- **Q4.** Public package name and org scope.

These questions do not block `ce-plan` for infrastructure and the token/atom layer if A1–A3 are accepted.

### Approaches considered

Three product shapes. Recommendation: Approach A.

**Approach A — Token-strict Atomic kit (recommended).**  
Layers, tokens, closed variants, a11y in the API. The consumer gets a system. Risk: slower to “throw a button together”. Fits because the user wants a system, not a widget bag.

**Approach B — Headless primitives + optional theme.**  
Maximum customization, weak visual discipline; the kit easily becomes a Radix wrapper. Rejected: breaks the strictness balance.

**Approach C — Copy-paste source kit.**  
Components live in the consumer repo. Rejected: conflicts with versioning/changelog as a product contract.

Infrastructure challenger: Vite+ as a unified oxlint+oxfmt orchestrator. Rejected for the foundation — separate oxlint/oxfmt CLIs are simpler for a library; the catalog already uses Vite. Revisit if toolchain commands proliferate.

### Success criteria

- A new author completes the Bootstrap flow without hand-configuring hooks.
- Adding a role color does not require component edits.
- A public atom cannot be used so that the automated a11y scanner and keyboard smoke fail on the default story.
- Consumer theming does not require a fork.
- Git history is readable conventional commits; a release has a Changeset changelog.
- No non-English documents or comments land in the repository.
- Coverage report is 100% statements, branches, functions, and lines on every kit source file.
- Every public export appears in Storybook under an Atomic Design title.

## Implementation Units (requirements-level)

Code planning will slice this further. These boundaries exist so `ce-plan` does not mix phases.

1. **U1 — Platform.** Workspace, pnpm, tsdown, oxlint, oxfmt, Lefthook, commitlint, Changesets, Vitest with 100% coverage thresholds (per file), Storybook skeleton with a11y addon, CI gates. No UI except a smoke component if the pipeline needs one. The smoke component MUST have a test and a story so the gates are real.
2. **U2 — Tokens.** Primitive / semantic / component token pipeline and CSS variable contract, light theme (dark per Q3).
3. **U3 — Atom contract.** The first atom (most likely Button + Text/Icon) as the API, a11y, story, test, and customization template. Later atoms copy this template instead of inventing a second one.
4. **U4+.** Molecules → organisms (modal, table) → layout templates. Each layer may use only layers below it. Do not start with table/modal.

## Ready for Planning

Complete: actors, outcome, in/out, a11y floor, customization contract, toolchain constraints, language rule, coverage, Storybook, RFC 2119, acceptance.  
Consistent: oxfmt vs oxlint are separated; Stylelint does not contradict the oxc-native goal; English-only, 100% coverage, and full Storybook are standing.  
Focused: one product — Ctrl UI foundation.  
Usable by planning: U1–U3 can be planned without answers to Q1–Q4. Implementation plans MUST use RFC 2119.
