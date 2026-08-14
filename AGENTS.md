# Agent instructions

## Language

All repository documents and code comments must be **English**. Strictly.

This includes plans, READMEs, ADRs, Storybook docs, JSDoc, inline comments, commit messages, and pull request titles/bodies.

Chat with the user may follow the user's spoken language. Committed work must not.

Do not write Russian or any other non-English prose into files, comments, or git metadata.

## Architecture

Follow `.cursor/rules/ctrl-ui-architecture.mdc` and `docs/plans/2026-08-14-001-product-ctrl-ui-foundation-plan.md`.

Standing constraints: Atomic Design (downward-only), token tiers, WCAG 2.2 AA, oxlint + oxfmt, Vitest 100% coverage (all categories, per file), full Storybook coverage of public exports, RFC 2119 language in implementation plans.
