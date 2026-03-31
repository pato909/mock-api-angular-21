---
name: angular-architecture
description: Analyze functional needs and design an Angular 21 application architecture without implementing it. Use when Codex needs to produce an architecture document for an Angular app, define feature boundaries, routes, state approach, data flow, UI structure, module or standalone organization, cross-cutting concerns, or delivery-oriented architectural decisions before coding begins.
---

# Angular Architecture

Design the architecture of an Angular 21 application from the user's functional needs.

## Core goal

- Do not implement the application.
- Do not generate production code unless the user explicitly asks for examples.
- Produce a clear architecture document that explains what the Angular application should be.
- Focus on structure, responsibilities, flows, constraints, tradeoffs, and recommended decisions.

## Default mindset

- Treat this as a pre-implementation architecture exercise.
- Optimize for clarity, maintainability, scalability, and Angular 21 alignment.
- Ground every architectural choice in the user's functional requirements and constraints.
- Prefer a pragmatic architecture over a theoretically perfect one.

## Inputs to extract

- Functional scope
- User journeys
- CRUD or workflow shape
- Data sources and API behavior
- Routing needs
- UI expectations
- Accessibility and performance requirements
- Technical constraints
- Explicit exclusions

## What to produce

Produce a Markdown architecture document. Default filename: `angular-architecture.md` unless the user asks for another name.

The document should usually cover:
- context and objective
- architectural principles
- recommended Angular 21 approach
- application structure
- feature decomposition
- routing strategy
- component strategy
- state strategy
- data access strategy
- form strategy
- shared UI and design system concerns
- error/loading/empty/not-found handling
- accessibility considerations
- risks, tradeoffs, and deferred decisions

## Angular 21 guidance

- Prefer standalone Angular APIs.
- Use lazy loading where feature boundaries justify it.
- Prefer `signals` for local state and view-facing state.
- Use `inject()` over constructor injection when appropriate.
- Recommend `ChangeDetectionStrategy.OnPush` on components.
- Be explicit about which Angular APIs are stable vs experimental when it matters.
- If `httpResource()` is a good fit for read flows, say so explicitly.
- If `httpResource()` is not a good fit everywhere, distinguish read and mutation strategies clearly.

## Architecture output guidance

- Describe the architecture in terms of responsibilities and boundaries, not implementation trivia.
- Name the main folders, layers, or feature areas.
- Explain why each major boundary exists.
- Show how data flows from route to page to UI to API.
- Show how mutations affect read models or refresh flows.
- Keep the document decision-oriented.

## Recommended sections

Use a structure like this when it fits:

```md
# Angular Architecture

## Context

## Recommended Architecture

## Application Structure

## Feature Boundaries

## Routing Strategy

## State and Data Flow

## Forms and Validation

## UI Composition

## Cross-Cutting Concerns

## Risks and Deferred Decisions
```

## Feature-first preference

- Prefer a feature-first structure unless the user's constraints strongly suggest otherwise.
- Separate `core`, `shared`, and feature folders when appropriate.
- Inside a feature, distinguish page-level concerns, domain/data concerns, models, and feature-local UI.
- Only recommend extra layers when they solve a real complexity.

## Decision style

- Give a recommended architecture, not just a menu of possibilities.
- If alternatives exist, mention them briefly and explain why the recommendation is preferred.
- Call out assumptions and deferred decisions clearly.
- Keep the document actionable for the next implementation phase.

## Out of scope

- Do not scaffold the Angular app.
- Do not write components, services, routes, or templates unless the user explicitly asks for examples.
- Do not turn the architecture document into a task breakdown unless the user asks for delivery planning.

## Working style

- Use the user's language and domain vocabulary.
- Prefer concise, high-signal explanations.
- If a requirement can be inferred from provided planning documents such as `grill-me.md`, use those documents instead of asking the user to repeat themselves.
- When the codebase already exists, align the architecture document with the current repository shape and call out any migration implications.
