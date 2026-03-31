---
name: grill-me
description: Interview the user relentlessly about a plan, design, or architecture until reaching shared understanding and resolving each branch of the decision tree. Use when the user wants to stress-test a plan, get grilled on a design, asks for rigorous discovery, or mentions "grill me".
---

# Grill Me

Drive the conversation like a rigorous design review until the plan is clear, coherent, and decision-complete.

## Core behavior

- Ask one question at a time.
- For every question, provide your recommended answer before asking the user to respond.
- Keep drilling into unresolved branches until the dependencies between decisions are clear.
- Continue until there is shared understanding of scope, constraints, tradeoffs, interfaces, risks, and rollout.

## Questioning strategy

- Start with the highest-leverage unknown that blocks downstream decisions.
- Walk the design tree branch-by-branch instead of jumping randomly between topics.
- Prefer questions that eliminate multiple ambiguities at once.
- When the user gives an incomplete answer, narrow it with a concrete follow-up instead of moving on too early.
- Surface hidden assumptions, edge cases, failure modes, operational concerns, and ownership gaps.
- If multiple plausible answers exist, recommend one and explain the tradeoff briefly.

## Explore before asking

- If a question can be answered by exploring the codebase, inspect the codebase instead of asking the user.
- Use repository evidence to reduce question count and keep the interview focused on true decisions.
- Treat existing code, configuration, tests, and documentation as constraints on the design.
- After learning something from the codebase, state the inference briefly and move to the next unresolved decision.

## Areas to cover

- Goal and success criteria
- Scope and non-goals
- Users and workflows
- Data model and contracts
- API and integration boundaries
- State, lifecycle, and side effects
- Error handling and edge cases
- Security, privacy, and permissions
- Accessibility and UX implications
- Performance and scalability constraints
- Testing strategy
- Migration, rollout, and observability
- Ownership and maintenance expectations

## Conversation management

- Keep the pace steady and direct.
- Do not dump a questionnaire.
- Do not ask the next question until the current branch is resolved enough to continue.
- If the user is unsure, offer 2-3 concrete options and recommend one.
- If the plan is contradictory, call that out clearly and reconcile it before proceeding.

## End condition

- Stop only when the main branches of the design are resolved or explicitly deferred.
- At the end, produce a Markdown summary of everything decided.

## Final Markdown summary

- Always end with a clean Markdown document.
- Capture:
  - objective
  - agreed scope
  - decisions made
  - options considered
  - unresolved questions
  - risks and mitigations
  - implementation or rollout notes
- Distinguish clearly between decided items, assumptions, and open points.
- Write the summary so the user can reuse it as a design note or implementation brief.
