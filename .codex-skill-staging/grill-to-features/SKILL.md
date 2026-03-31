---
name: grill-to-features
description: Convert a `grill-me.md` product/design discovery document into an ordered implementation plan made of concrete features with descriptions, acceptance criteria, and effort estimates, then prepare or create matching GitHub feature issues. Use when Codex needs to turn a grilled design summary into a delivery roadmap, backlog, implementation sequence, or GitHub-ready feature list.
---

# Grill To Features

Turn a `grill-me.md` discovery summary into an execution-ready feature backlog.

## Core outcome

- Read the `grill-me.md` document first.
- Derive the implementation features required to deliver the agreed scope.
- Order the features by dependency and delivery sequence.
- Produce a Markdown document that lists all features in implementation order.
- For each feature, include:
  - title
  - short description
  - acceptance criteria
  - estimate
- When the user asks to add them to GitHub, create GitHub issues that map cleanly to those features.

## How to read the source document

- Treat `grill-me.md` as the source of truth for scope and decisions.
- Extract:
  - objectives
  - scope
  - technical constraints
  - UX constraints
  - explicit exclusions
  - dependencies between decisions
- Do not invent large new scope outside the document.
- If the document is ambiguous, prefer the narrowest interpretation that still delivers the agreed V1.

## How to define a feature

- Make each feature independently understandable.
- Prefer slices of work that produce a coherent outcome, not raw technical chores.
- Keep features large enough to be meaningful, but small enough to estimate and track.
- Split foundational work from feature-facing work when dependencies require it.
- Avoid mixing unrelated concerns into one feature.

## Ordering rules

- List features in delivery order.
- Put foundational setup first.
- Then list shared infrastructure.
- Then primary user-facing flows.
- Then refinements, edge cases, and polish.
- Make dependency chains explicit when useful.

## Feature format

Use a consistent format such as:

```md
## F01 - App Shell and Routing

**Description**
Create the Angular application shell, top app bar, routing structure, and feature-first folder organization needed to support the persons feature.

**Acceptance Criteria**
- The app starts with a top app bar and centered content layout.
- Routes exist for `/persons`, `/persons/new`, `/persons/:id`, and `/persons/:id/edit`.
- The codebase follows the agreed feature-first structure.

**Estimate**
M
```

## Acceptance criteria guidance

- Write acceptance criteria as observable outcomes.
- Prefer concrete and testable statements.
- Include UX and state behavior when it materially affects the feature.
- Include error, loading, and empty behavior when that feature owns it.
- Do not overload criteria with implementation details unless they are architecturally important.

## Estimation guidance

- Use a simple estimate scale unless the user asked for another system.
- Default to `XS`, `S`, `M`, `L`, `XL`.
- Estimate based on implementation complexity, uncertainty, and dependency risk.
- Keep estimates relative, not hour-by-hour promises.

## Output document

- Create a Markdown backlog document in the workspace.
- Default filename: `features-roadmap.md` unless the user asks for another name.
- Start with a short summary of scope and sequencing logic.
- Then list all features in order.
- End with a short section for assumptions, dependencies, or open risks if needed.

## GitHub creation workflow

- If the user asks to add the features to GitHub, first check local repo context and available GitHub tooling.
- Prefer creating GitHub issues labeled as features when "features" in GitHub is not otherwise defined.
- If a project board, milestones, or labels already exist, reuse them instead of inventing a parallel system.
- Use the generated Markdown backlog as the source for issue titles and bodies.
- Keep each GitHub issue aligned to one feature from the document.
- Include:
  - description
  - acceptance criteria
  - estimate
  - ordering/dependency note when useful

## GitHub safety and ambiguity handling

- If the repository is not connected to GitHub or authentication is missing, stop after producing the Markdown document and state the blocker clearly.
- If "feature" could mean issue, project item, or milestone, prefer GitHub issue unless repo context clearly indicates another workflow.
- Do not create duplicate issues if equivalent open issues already exist.

## Working style

- Favor clarity over exhaustive decomposition.
- Use the user's chosen product vocabulary.
- Preserve the delivery intent of the original `grill-me.md`.
- When codebase structure already exists, align the feature breakdown with it instead of forcing a generic template.
