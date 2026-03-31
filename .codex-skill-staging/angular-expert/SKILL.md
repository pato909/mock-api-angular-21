---
name: angular-expert
description: Build, refactor, review, and explain Angular applications with strict TypeScript, standalone Angular v20+ APIs, signals, accessibility-first UI, and scalable frontend architecture. Use when Codex needs to write or assess Angular components, routes, templates, forms, services, state management, performance, or API integration while following strong Angular conventions and preferring `httpResource()` when it fits the data-fetching flow.
---

# Angular Expert

Follow these rules when working on Angular code.

## Core approach

- Write functional, maintainable, performant, and accessible code.
- Preserve the repository's architecture unless the task explicitly calls for a refactor.
- Keep components and services small, focused, and easy to test.
- Favor straightforward code over clever abstractions.

## TypeScript best practices

- Keep strict type checking intact.
- Prefer type inference when the type is obvious.
- Avoid `any`; use `unknown` when the type is uncertain.
- Keep transformations pure and predictable.

## Angular best practices

- Use standalone APIs; do not introduce NgModules for new work.
- Do not set `standalone: true` in Angular decorators. In Angular v20+, standalone is the default.
- Use signals for local state management.
- Implement lazy loading for feature routes when the route boundary allows it.
- Do not use `@HostBinding` or `@HostListener`; put host bindings in the `host` object of the decorator.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` on components.
- Use `inject()` instead of constructor injection.

## Components

- Keep each component focused on a single responsibility.
- Use `input()` and `output()` functions instead of decorator-based inputs and outputs.
- Use `computed()` for derived state.
- Prefer inline templates for small components.
- Use paths relative to the component TypeScript file for external templates and styles.

## State management

- Use signals for local component state.
- Use `computed()` for derived state.
- Use `update()` or `set()` on signals; do not use `mutate()`.
- Keep state transitions explicit, pure, and predictable.

## Templates

- Keep templates simple and move complex logic into the class or pure helpers.
- Use Angular native control flow: `@if`, `@for`, and `@switch` instead of `*ngIf`, `*ngFor`, and `*ngSwitch`.
- Use the async pipe to consume observables in templates.
- Do not use `ngClass`; use explicit `class` bindings instead.
- Do not use `ngStyle`; use explicit `style` bindings instead.
- Do not assume globals such as `new Date()` are available in templates.

## Forms

- Prefer Reactive Forms over template-driven forms.

## Services and data access

- Design each service around a single responsibility.
- Use `providedIn: 'root'` for singleton services.
- Prefer `httpResource()` over ad hoc `HttpClient` service wrappers when the use case is declarative data fetching that maps cleanly to Angular resource patterns.
- Fall back to `HttpClient` when the workflow is imperative or resource semantics are a poor fit, for example uploads, progress tracking, complex orchestration, or highly customized request flows.

## Accessibility requirements

- Make the result pass AXE checks.
- Meet WCAG AA minimums for semantics, focus management, keyboard support, contrast, and ARIA usage.
- Prefer native HTML controls before adding ARIA.

## Images and performance

- Use `NgOptimizedImage` for static images.
- Do not use `NgOptimizedImage` for inline base64 images.
- Avoid unnecessary DOM work, change detection churn, and oversized bundles.

## Working style

- Match existing repository conventions when they do not conflict with these rules.
- When reviewing code, prioritize regressions in accessibility, signal usage, template complexity, typing, and lazy loading.
- Prefer examples that are ready to reuse in production code.
