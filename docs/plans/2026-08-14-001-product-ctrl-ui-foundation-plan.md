---
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
title: Ctrl UI Foundation - Plan
date: 2026-08-14
status: requirements-only
doc_review: 2026-08-19
---

# Ctrl UI Foundation - Plan

## Goal Capsule

**Objective.** Lock the product frame and infrastructure contract for Ctrl UI: a public React + TypeScript UI kit that grows through Atomic Design from tokens to complex compositions, is accessible out of the box, and gives consumers predictable customization without dissolving the system.

**Product authority.** This document is the requirements source until `ce-plan`. The `dedOfficial/ctrl-ui` repository is currently empty (MIT, Compound Engineering config example). Code, package schemas, and exact configs are out of this document.

**This increment.** Toolchain and the token pipeline only. Atoms and every layer above them are the same product, delivered in later increments.

**Open blockers.** Nothing blocks `ce-plan` for **U1 Platform**. The visual-language reference (**Q2**) blocks treating token *values* as the shipped identity contract. Semantic *roles* (inventory below) are not blocked. A first consuming app is unset and does not block this increment.

## How This Work Fits Together

One product: **Ctrl UI**. Infrastructure and the design system are not separate products — a package without a layer model is meaningless, and layers without a toolchain cannot be honestly gated (a11y, lint, versioning).

**This increment (code delivery):**

1. Toolchain and git discipline (so every later layer already lives behind the right gates).
2. Tokens and the CSS-variable contract (primitive → semantic → component-token tiers).

**Later increments of the same product (not this slice):**

3. Atoms with the a11y contract.
4. Molecules.
5. Organisms (modal, table, and similar).
6. Templates / layout shells.

Coverage and Storybook gates (D14, D15) apply to public exports that **exist**. They MUST NOT be used as a reason to create atoms or later layers in this increment.

Implementation planning MUST slice only U1 and U2 for this increment. It MUST NOT change layer, a11y, or customization rules.

## Product Contract

### Primary actors

- **Kit author** — develops Ctrl UI in this repository.
- **Feature consumer** — a product team that installs the package and builds screens. Must not have to assemble keyboard navigation, focus traps, and ARIA for shipped UI modules.

### Positioning

Ctrl UI is an **opinionated design-system kit**, not a headless set and not a copy-paste catalog like shadcn. The consumer gets a finished visual language and accessible behavior. Customization goes through tokens, a closed variant set, and composition — not through unbounded style props.

**First target consumer.** This is the **intended first live use** (pilot / design partner), not a team that already installs Ctrl UI — the kit does not exist yet. Name a real team or product you will try the kit on first, plus one reason they would pick it over assembling headless primitives.

Until that name is written here, the placeholder is: product teams building React UI who would otherwise compose headless primitives and restyle them. They would pick Ctrl UI because WCAG 2.2 AA behavior and a closed visual language ship in the package, and they can retarget color, density, and type through semantic tokens without forking.

Fill in:

- **Who:** own product, internal team, or an external pilot (name the team/product).
- **What they ship:** one sentence (for example internal admin, B2B app).
- **Why Ctrl UI:** one concrete reason versus Radix + custom CSS, shadcn, or a copy-paste catalog.
- **Visual reference (Q2):** link, screens, or “none yet — revisable neutral”. Who is not the same as how it looks; Q2 can come from this pilot’s UI, but it is a separate answer.

Adjacent product shapes we are not building:

- Headless-only (Radix/React Aria as the product) — maximum freedom, no system. React Aria is an implementation dependency for later composite layers, not the product.
- Utility-first kit with Tailwind as the public API — consumers bypass tokens.
- Source-copy kit — breaks Conventional Commits / semver as the delivery contract.
- A Next.js / App Router kit as a separate package.

### Core outcome

**Standing product outcome.** A feature consumer can install the kit, theme it through semantic tokens, and assemble screens from public UI modules without breaking kit-owned a11y. Visual hierarchy is enforced through tokens, closed variants, and composition. `className` / slot class is a documented last-resort appearance hatch: it MUST NOT strip `role`, the `:focus-visible` contract, or keyboard behavior. Channel 4 is not a promise that visual hierarchy is unbreakable.

**This increment’s validation.** This foundation validates **kit-author catalog composition** (token pipeline, theme switch in Storybook, toolchain gates). A consumer-shaped “assemble a screen” flow is out of validation until a consuming app exists. Isolated Default stories and a catalog theme switch MUST NOT be treated as proof of that standing outcome.

### Language (repo artifacts)

All documents, plans, READMEs, Storybook docs, JSDoc, inline comments, commit messages, and pull request text in this repository are **English only**. Chat with humans may use another language; committed work must not. Standing instruction for agents: `AGENTS.md` and the single-responsibility files in `.cursor/rules/`. R13/D13 cover **repo prose**, not UI copy (see i18n).

### In scope

**This increment (U1–U2):**

- Infrastructure contract: package manager, library build, docs/catalog, lint/format, git hooks, conventional commits, versioning.
- Token pipeline: primitive → semantic → component tokens, CSS custom properties, locked semantic inventory, WCAG 2.2 AA contrast on painted pairs.
- Atomic Design as the primary architecture (folders, dependency direction, and rules), even while later layers have no public UI modules yet.
- Storybook gallery stories for each public token collection.
- Vitest with a strict 100% coverage gate on kit source (domain below).
- English-only committed prose.
- RFC 2119 keyword language in every future implementation plan.
- Public (or workspace) package that a consumer can install without cloning this repository; semantic tokens apply after install.
- Token/CSS modules that ordinary React and RSC hosts can import without a Next-specific package.
- Direction and typography tokens that can support RTL layout.

**Standing product (later increments, same kit):**

- Atoms, then molecules, then organisms, then templates, with downward-only dependencies.
- WCAG 2.2 AA as the floor for every public UI module.
- Customization contract (four channels).
- Full Storybook coverage of every public UI-module export (Default, each public variant, each required public state).
- Native HTML + APG for atoms; React Aria for molecules and organisms when those layers exist.
- String overrides for kit copy; RTL layout on public UI modules.
- `"use client"` on published modules that use client APIs.

### Out of scope

**Permanent (not this product):**

- Native iOS/Android kit.
- A Figma library as a required first-delivery artifact.
- Marketing site, changelog portal, paid product.
- Copying another visual language (MUI, Chakra, shadcn).
- An App Router / Next-specific framework kit as a separate package.
- A full localization platform (ICU catalogs, translation pipelines).
- Visual regression / screenshot tests (desirable later; not a foundation gate).

**Deferred (same product, not this increment):**

- Atoms, molecules, organisms, and templates as code.
- React Aria as a dependency (add it when the first composite UI module lands).
- String-override API (lands with the first atom that ships copy).
- `"use client"` directives (land with the first client atom).

### Customization vs strictness

Customization is allowed only through four channels, in this priority:

1. **Semantic tokens / theme** — the primary channel (role color, density, radius, typography, light/dark scheme).
2. **Closed variant props** (`intent`, `size`, `appearance`) — finite enums, not free-form style strings.
3. **Composition** — compound modules and slots for structure, not for replacing semantics.
4. **Escape hatch** — `className` / slot class on documented nodes, last resort. MUST NOT strip `role`, `:focus-visible`, or keyboard behavior. This is an appearance hatch, not an unbreakable hierarchy promise.

Forbidden as public API:

- Props such as `backgroundColor`, `sx`, or an arbitrary CSS-in-JS theme object as the main path.
- Turning off semantics and keyboard behavior “to make styling easier”.
- Direct use of primitive tokens in UI modules and by consumers (semantic / component tokens only).

Kit-author strictness:

- A UI module contains no literal colors, spacing, or type values outside the token pipeline.
- A one-off visual prop is not added; add a token or a variant first.
- Atomic Design layers do not import upward.
- In token context, the third tier is **component tokens**. UI modules are **atoms / molecules / organisms / templates**, never “components” when that token tier is in scope.

### Accessibility floor

**This increment (tokens).** No ARIA library. Tokens encode contrast, the focus-ring contract, minimum 24×24 CSS px target size, and `prefers-reduced-motion`.

**Later — atoms.** Native HTML (`button`, `a`, `input`, and the matching elements) plus APG. Do not wrap those primitives in a headless layer to ship Button and peers.

**Later — molecules and organisms.** **React Aria** (not Radix, not a from-scratch composite). Ctrl UI owns visuals and tokens. Do not add React Aria until the first composite lands. Do not mix React Aria and Radix.

Every public UI module (when it exists):

- Meets WCAG 2.2 AA, including Target Size 2.5.8 (minimum 24×24 CSS px) and Focus Not Obscured 2.4.12.
- Keyboard: Tab/Arrow/Enter/Space/Escape per APG for that pattern.
- Has a visible `:focus-visible` indicator.
- Icon-only controls have an accessible name.
- Form errors are announced with `role="alert"` / `aria-live`, not color alone.
- Overlays: focus trap, focus return, `Escape` (via React Aria when that layer exists).
- Automated a11y checks in the catalog and in tests are required; a manual keyboard pass is part of Definition of Done for overlay and composite widgets.

A consumer may **add** ARIA, but cannot strip the contract the kit owns.

### Internationalization

Consumers MUST be able to override kit strings. Layout MUST support RTL.

This increment MAY encode direction and typography tokens only. String overrides land with the first atom that ships copy. A full localization platform is out of scope.

R13/D13 (English-only) apply to repository prose, not to runtime UI copy.

### React hosts

The kit MUST work in ordinary React. RSC hosts MUST be able to import it without a Next-specific package. Published modules that use client APIs MUST be marked `"use client"`.

This increment MAY ship CSS/token modules that are RSC-safe. `"use client"` lands with the first client atom.

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
| Coverage | **100% statements, branches, functions, lines; `perFile: true`** on kit source (domain below) | session-settled; Vitest `coverage.thresholds['100']`; istanbul recommended |
| Lint | **oxlint only** for JS/TS/TSX | session-settled; ESLint is not introduced |
| Format | **oxfmt**, not Prettier and not oxlint | oxlint is not a formatter; oxfmt is the Prettier-compatible Oxc replacement |
| CSS lint | **no Stylelint at foundation** | oxlint does not lint CSS; keep Stylelint YAGNI by shrinking the CSS surface (see investigation below) |
| Git hooks | **Lefthook** | one runner: staged oxlint/oxfmt + commit-msg |
| Commits | **Conventional Commits** via commitlint | session-settled |
| Versioning | **Changesets** + semver | library changelog quality beats auto-bump from commit type; conventional commits remain history discipline |
| Node | **Node 22** (Active/LTS at plan time) | |
| Package module | **ESM-only** | CJS dual-publish only if a real consumer is blocked |
| Styles | Tokens → CSS custom properties; UI-module styles live in TypeScript, not a large SCSS codebase | so oxlint covers style code and oxfmt formats the rare CSS dump |
| Repo language | **English only** for documents, plans, READMEs, Storybook docs, JSDoc, inline comments, commit messages, and pull request text | session-settled |

### Semantic token inventory

Foundation semantic roles, independent of the brand reference (Q2):

- Color: `surface`, `on-surface`, `action`, `on-action`, `danger`, `on-danger`, `focus`
- Plus: space, radius, typography, density

Each painted foreground/background pair MUST meet WCAG 2.2 AA contrast. Primitive tokens stay private. UI modules and consumers use semantic or component tokens only.

Concrete primitive *values* (the identity palette) stay revisable until Q2 is answered. A temporary neutral theme MAY ship so the pipeline is real; those values MUST NOT be treated as the identity contract until Q2.

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

### Coverage domain (R14)

Kit source for the 100% gate is **author-written `.ts` / `.tsx` in the public kit package**.

Exclude: `*.stories.*`, type-only files, generated token output, and re-export barrels.

Those exclusions MUST NOT hide author-written kit source. A file is not “covered” by existing only as a story. Catalog-app scaffolding that is not published is also out of the gate.

### Storybook completeness

Every public export is catalogued. Story titles follow Atomic Design (`Atoms/Button`, `Tokens/Color`). Autodocs and the a11y addon are on.

**UI modules** (atoms and up, when they exist): Default, each public variant, and each required public state. A public UI module without those stories MUST NOT merge.

**Token collections:** one gallery story per public token collection (`Tokens/Color`, `Tokens/Space`, `Tokens/Typography`, and peers). A token public export is a **collection module**, not an individual token constant. Do not invent Default/variant/state stories per constant.

### Public state contract (atoms, later increment)

Interactive atoms, when they exist, expose:

- Default
- hover
- focus-visible
- pressed
- disabled
- loading/busy when the control can wait
- invalid when the atom is form-capable

Hover and pressed are required public states, not CSS-only extras. Each required state MUST have a CSF3 story and a specification-style test.

The first atom’s public prop-and-token contract stays revisable until **Q1** (publish vs private/workspace package) is answered. Semver majors apply from the first npm publish. If Q1 is public publish, the visual-identity bet (Q2) MUST be settled before that atom is treated as the copy-template for later atoms.

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
3. Do not add Stylelint until there is a hand-written CSS codebase. Tokens compile to CSS variables; UI modules are styled so most style code is TypeScript. If substantial hand-written CSS appears later — then a narrow Stylelint, not “just in case”.

### Requirements

**This increment**

- **R1.** A kit author can clone the repository, enable Corepack, and get hooks, lint, format, typecheck, test, and catalog from one dependency install.
- **R2.** A commit with a non-conventional message is rejected locally (commit-msg hook) and in CI.
- **R3.** Staged JS/TS passes oxlint and oxfmt before it enters git; CI repeats the full check.
- **R4.** The public package does not contain catalog, tests, or toolchain configs as runtime dependencies.
- **R5.** Tokens are the only source of visual decisions. Primitives do not leak into the public API. Semantic inventory and AA contrast on painted pairs are as specified above.
- **R6.** Atomic Design is the primary architecture and is followed strictly. Every public module lives in exactly one layer. Layers depend only downward. A layer violation is a defect and MUST NOT merge.
- **R8.** Theme switches without forking UI modules (semantic layer / CSS variables).
- **R13.** All committed documents, plans, READMEs, Storybook docs, JSDoc, inline comments, commit messages, and pull request text are English.
- **R14.** Author-written `.ts` / `.tsx` in the public kit package MUST meet Vitest coverage of 100% statements, branches, functions, and lines, globally and per file. Exclude `*.stories.*`, type-only files, generated token output, and re-export barrels. CI MUST fail otherwise.
- **R15.** Every public export MUST have Storybook stories. Token collections MUST have one gallery story per collection module. A public UI module without the required story matrix MUST NOT merge.
- **R16.** Test titles MUST follow the specification-style convention in `.cursor/rules/tests.mdc` (`describe` + `it`, no “should” prefix, behavior not implementation).
- **R17.** Every implementation plan MUST use RFC 2119 keywords and include the RFC 2119 key-words sentence.
- **R18.** A feature consumer can install the public (or workspace) package, satisfy the React peer, and apply semantic tokens without cloning this repository.
- **R19.** The kit works in ordinary React. RSC hosts can import it without a Next-specific package. Token/CSS modules in this increment are RSC-safe.

**Standing (when the relevant layer exists)**

- **R7.** Every public UI module has: a TypeScript prop contract, CSF3 stories for Default, each public variant, and each required public state, plus an a11y check.
- **R9.** A feature consumer customizes appearance only through channels 1–4 above. Breaking semantics through the public API is impossible or rejected by types. `className` MUST NOT strip `role`, `:focus-visible`, or keyboard behavior.
- **R10.** Overlay and composite widgets (when they exist) ship their own focus management and keyboard behavior via React Aria; Ctrl UI owns the visual layer.
- **R11.** Package version and changelog are driven by Changesets; a public API breaking change is a major from the first npm publish.
- **R12.** Public UI-module docs describe: purpose, variants, tokens, and what must not be overridden.
- **R20.** Consumers can override kit strings. Layout supports RTL.
- **R21.** Published modules that use client APIs are marked `"use client"`.
- **R22.** A feature consumer can import a public atom from the installed package (not only from this repo).
- **R23.** Interactive atoms expose the public state matrix (Default, hover, focus-visible, pressed, disabled, loading/busy when waiting, invalid when form-capable), each with a story and a specification-style test.

### Primary flows

1. **Bootstrap.** Author installs dependencies → hooks are active → `lint` / `fmt:check` / `typecheck` / `test` / `catalog` work on the empty skeleton.
2. **Add a token.** Author adds a primitive and a semantic mapping → CSS variables update → no UI module is edited by hand to change a color role.
3. **Add an atom (later increment).** Author builds the atom on tokens → story + a11y test → changeset → conventional commit. The consumer sees closed variants and theme, not internal primitives.
4. **Theme in the catalog (this increment’s consumer-shaped check).** Author (or a workspace consumer) installs the package, sets semantic tokens (or picks a shipped theme), and confirms roles update in token gallery stories. A full product screen is out of validation until a consuming app exists.
5. **Release.** Changeset on the PR → CI green → version bump + changelog → publish the ESM package.

### Acceptance examples

- A consumer changes `--color-action-primary` (or the equivalent semantic token) — all primary actions and matching states follow it. Source of public UI modules is untouched.
- An icon-only `Button` without an accessible name fails the a11y test and/or a type-level ban (later increment).
- `className` on the root changes the outer wrapper but does not remove `role`, the focus-ring contract, or the keyboard handler (later increment).
- Commit `fixed button` is rejected; `fix(button): restore focus ring on dark theme` is accepted.
- The published tarball does not contain `apps/catalog` or toolchain `node_modules`.
- A new plan, comment, or JSDoc committed in a non-English language is rejected in review (and later by lint/CI if such a gate exists).
- CI fails if any included kit source file is below 100% statements, branches, functions, or lines.
- A new public `Button` variant without a story and without an `it('…')` for that state cannot merge (later increment).
- Token collections appear in Storybook as galleries (`Tokens/Color`, and peers), not as one story file per constant.
- A workspace or published install can import token CSS/variables without cloning this repository.
- This increment can be declared done without a consumer-assembled screen.

### Non-goals

- A universal CSS framework.
- Vue / Svelte / React Native support in this product.
- A pixel-perfect copy of an existing library.
- “Any customization at any cost”.
- Declaring the standing consumer-screen outcome proven by catalog stories alone.

### Key decisions

- **D1.** React + TypeScript. `session-settled: user-stated`
- **D2.** Atomic Design is the primary architecture and MUST be followed strictly (tokens → atoms → molecules → organisms → templates; sub-atoms = tokens). `session-settled: user-stated`
- **D3.** Conventional Commits + git hooks. `session-settled: user-stated`
- **D4.** ESLint is not used; JS/TS lint = oxlint. `session-settled: user-stated`
- **D5.** Prettier is not used; format = oxfmt (not oxlint). `session-settled: investigated-from-user-intent`
- **D6.** Stylelint is not introduced at foundation; CSS surface is deliberately small. Revisit if hand-written CSS appears. `session-settled: investigated-from-user-intent`
- **D7.** The product is an opinionated kit, not headless and not copy-paste. `recommended default`
- **D8.** Customization: tokens → variants → composition → className last resort. `className` MUST NOT strip role, focus-visible, or keyboard. `session-settled: user-stated`
- **D9.** pnpm + tsdown + Storybook/Vite + Vitest + Lefthook + commitlint + Changesets. `recommended default`
- **D10.** ESM-only, Node 22, React as peer. `recommended default`
- **D11.** WCAG 2.2 AA is the floor, not a later goal. `session-settled: user-stated` (AA level is the recommended default)
- **D12.** Hybrid a11y: native HTML + APG for atoms; React Aria for molecules and organisms when those layers exist; Ctrl UI owns visuals and tokens. Do not add React Aria until the first composite. Do not use Radix. `session-settled: user-stated`
- **D13.** All repository documents, plans, READMEs, Storybook docs, JSDoc, inline comments, commit messages, and pull request text are English only. `session-settled: user-stated`
- **D14.** Vitest with strict 100% coverage in all four categories, per file, on the coverage domain in R14. Istanbul is the recommended provider. `session-settled: user-stated`
- **D15.** The kit is fully Storybooked: UI modules use the Default/variant/state matrix; token collections use one gallery story per collection module. `session-settled: user-stated`
- **D16.** Test descriptions use specification-style `describe`/`it` titles (Vitest testing-in-practice + BDD grouping; no “should” prefix). `session-settled: investigated-from-user-intent`
- **D17.** Future implementation plans use RFC 2119 requirement keywords. `session-settled: user-stated`
- **D18.** Standing agent rules are single-responsibility files in `.cursor/rules/` (product shape, layers, tokens, customization, accessibility, toolchain, tests, Storybook, implementation plans, English). `session-settled: user-stated`
- **D19.** This increment is toolchain + tokens only. Atoms and later layers are the same product, later slices. D14/D15 gate exports that exist; they do not create later layers. `session-settled: user-stated`
- **D20.** Visual-language reference (Q2) blocks the token visual identity contract, not toolchain bootstrap. Semantic roles are independent of brand. `session-settled: user-stated`
- **D21.** Foundation semantic inventory: surface, on-surface, action, on-action, danger, on-danger, focus; plus space, radius, typography, density. Painted pairs meet AA. Primitives stay private. `session-settled: user-stated`
- **D22.** This foundation validates kit-author catalog composition. A consumer-shaped screen is out of validation until a consuming app exists. `session-settled: user-stated`
- **D23.** First atom public API stays revisable until Q1. Semver majors start at first npm publish. Public publish requires Q2 before that atom is the copy-template. `session-settled: user-stated`
- **D24.** Third token tier is **component tokens**. UI modules are atoms, molecules, organisms, and templates — not “components” in token context. `session-settled: user-stated`
- **D25.** Consumers can override kit strings; layout supports RTL. This increment may ship direction/typography tokens only. `session-settled: user-stated`
- **D26.** Ordinary React is the host. No Next-specific package. Client modules are marked `"use client"` when they use client APIs. `session-settled: user-stated`
- **D27.** A feature consumer can install the package without cloning this repository. Import of a public atom is a standing requirement when atoms exist. `session-settled: user-stated`

### Assumptions

- **A1.** The repository is public MIT; the kit is intended for npm under a name derived from `ctrl-ui`. Exact scope (`ctrl-ui` vs `@ctrl-ui/react`) is confirmed at first publish.
- **A2.** There is no first consuming app in production yet. The first target consumer is an intended pilot, not a current installer. The starting theme is a revisable neutral until Q2, not a specific product brand.
- **A3.** Storybook is enough documentation catalog; a marketing docs site is not needed in the foundation.
- **A4.** A full localization platform is not built now. String overrides and RTL are requirements (D25), not this assumption.
- **A5.** Visual regression (screenshot tests) is desirable later; foundation is a11y + unit + story states. Coverage 100% is not visual correctness.
- **A6.** The brainstorm ran in a non-interactive Cloud Agent mode: product forks the user did not lock are recorded as recommended defaults, not as silently “already agreed”.

### Outstanding questions

- **Q1.** Is npm publish part of the first implementation slice, or is a private/workspace package enough? Blocks freezing the first atom as a copy-template and when majors start. Does not block U1–U2.
- **Q2.** Is there a visual-language reference (existing product, palettes, density)? Often taken from the intended first pilot, but it is not the same as naming that team. Blocks treating token values as the identity contract. Does not block U1 or semantic *roles*.
- **Q3.** Is dark theme in the first token drop, or only the contract for it?
- **Q4.** Public package name and org scope.

U1 MAY be planned with A1–A3. U2 MAY implement roles and pipeline without Q2; it MUST NOT treat a temporary palette as identity until Q2.

### Approaches considered

Three product shapes. Recommendation: Approach A.

**Approach A — Token-strict Atomic kit (recommended).**  
Layers, tokens, closed variants, a11y in the API. The consumer gets a system. Risk: slower to “throw a button together”. Fits because the user wants a system, not a widget bag.

**Approach B — Headless primitives + optional theme.**  
Maximum customization, weak visual discipline; the kit easily becomes a Radix or React Aria wrapper as the product. Rejected: breaks the strictness balance. React Aria remains an implementation dependency for later composites only.

**Approach C — Copy-paste source kit.**  
UI modules live in the consumer repo. Rejected: conflicts with versioning/changelog as a product contract.

Infrastructure challenger: Vite+ as a unified oxlint+oxfmt orchestrator. Rejected for the foundation — separate oxlint/oxfmt CLIs are simpler for a library; the catalog already uses Vite. Revisit if toolchain commands proliferate.

### Success criteria

**This increment**

- A new author completes the Bootstrap flow without hand-configuring hooks.
- Adding a role color does not require UI-module edits.
- Token galleries in Storybook show the locked semantic inventory.
- Consumer theming of semantic roles does not require a fork or a repo clone.
- Git history is readable conventional commits; a release has a Changeset changelog when publishing is in scope.
- No non-English documents, comments, commit messages, or pull request text land in the repository.
- Coverage report is 100% statements, branches, functions, and lines on every included kit source file.
- Every public token collection appears in Storybook under an Atomic Design title.

**Standing (later increments)**

- A public atom cannot be used so that the automated a11y scanner and keyboard smoke fail on the default story.
- A feature consumer can recognize and theme the shipped identity without forking (requires Q2).
- Interactive atoms expose the locked state matrix with stories and tests.

## Implementation Units (requirements-level)

This increment plans **U1** and **U2** only. Later units stay on the product trajectory.

1. **U1 — Platform.** Workspace, pnpm, tsdown, oxlint, oxfmt, Lefthook, commitlint, Changesets, Vitest with 100% coverage thresholds (per file, coverage domain in R14), Storybook skeleton with a11y addon, CI gates. No public UI module. A pipeline smoke export, if needed, MUST have a test and a story so the gates are real, and MUST NOT be treated as the first atom or as a public atom template.
2. **U2 — Tokens.** Primitive / semantic / component-token pipeline and CSS variable contract; locked semantic inventory; light theme (dark per Q3); gallery stories per collection; revisable neutral values until Q2.
3. **U3 — Atom contract (later).** The first atom (most likely Button + Text/Icon) as the API, a11y, story, test, and customization template. Later atoms copy this template instead of inventing a second one. Contract stays revisable until Q1; if public publish, Q2 first.
4. **U4+ (later).** Molecules → organisms (modal, table, via React Aria) → layout templates. Each layer may use only layers below it. Do not start with table/modal. Do not add React Aria before the first composite.

## Ready for Planning

Complete: actors, outcome, in/out (permanent vs deferred), a11y hybrid, customization contract, toolchain constraints, language rule, coverage domain, Storybook split, i18n, RSC, RFC 2119, acceptance.  
Consistent: oxfmt vs oxlint are separated; Stylelint does not contradict the oxc-native goal; English-only, 100% coverage, and full Storybook are standing; this increment is toolchain + tokens.  
Focused: one product — Ctrl UI; this slice is U1–U2.  
Usable by planning: U1–U2 can be planned without answers to Q1 and Q4. Q2 blocks identity values, not U1. Implementation plans MUST use RFC 2119.

`ce-doc-review` walk-through (2026-08-19): findings 1–3, 5–8, 10–15 applied; findings 4 and 9 withdrawn into D12 (hybrid a11y).
