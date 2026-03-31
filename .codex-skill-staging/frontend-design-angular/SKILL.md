---
name: frontend-design-angular
description: Design Angular 21 application mockups only, with a strong visual point of view and product-aware frontend direction. Use when Codex needs to explore how Angular pages, flows, or the full app should look before implementation, and must produce only mockups or Figma-ready screen proposals without writing implementation code.
---

# Frontend Design Angular

Design Angular 21 interfaces as mockups only.

## Core goal

- Produce mockups and visual design proposals only.
- Prefer Figma mockups when visual generation is requested or available.
- Do not implement the application.
- Do not generate Angular, HTML, CSS, or TypeScript production code.
- Help the user see what the Angular app should look like before coding starts.

## First source of truth

Base the design on the strongest available product context, in this order:

1. user request
2. planning documents such as `grill-me.md`
3. architecture documents such as `angular-architecture.md`
4. delivery or feature documents such as `features-roadmap.md`
5. existing codebase, routes, components, and design system

If these sources define product intent, flows, tone, or constraints, use them instead of inventing a disconnected visual concept.

## What to produce

Produce mockup-oriented artifacts only, such as:
- Figma mockups
- screen-by-screen visual descriptions
- page mockups in Markdown
- annotated UI proposals
- layout and section breakdowns
- component-level mockup notes
- design directions for the full Angular application

When Figma tools are available and the request is to create mockups, prefer generating editable Figma outputs instead of implementation code.

If useful, structure the answer by page:
- app shell
- list page
- detail page
- create form
- edit form
- states such as loading, empty, error, and not found

## Strict non-implementation rule

- Do not scaffold Angular.
- Do not write standalone components.
- Do not write templates.
- Do not write stylesheets.
- Do not write services, routes, or data-layer code.
- Do not generate production-ready code unless the user explicitly changes the request.

The output must stay at mockup and design-definition level.

## How to derive the design direction

Before producing mockups, determine:
- what the screen is for
- who uses it
- what the most important user action is
- what emotional tone matches the product
- what the UI should make memorable

Then choose a strong aesthetic direction and adapt it to Angular product UI. Good directions include:
- editorial
- refined minimal
- enterprise-premium
- brutalist
- futuristic
- industrial
- soft but structured
- high-contrast utilitarian

The key is to commit to one direction and make it fit the product domain.

## Angular-specific design rules

- Respect the existing Angular application architecture.
- Prefer mockups that fit the route/page/component structure already defined.
- Preserve the product logic implied by the Angular architecture even though no code is generated.
- Keep page containers and feature-local UI boundaries in mind when proposing screens.
- If Angular Material is already part of the product direction, style the mockups intentionally rather than showing raw demo-like Material.

## What to use as design input

When available, extract design guidance from:
- screen purpose in `grill-me.md`
- page responsibilities in `angular-architecture.md`
- delivery scope in `features-roadmap.md`
- existing app shell, typography, color system, and shared UI patterns

If there is no established visual system, define one in mockup form:
- color palette
- typography direction
- spacing rhythm
- surface treatment
- motion concept

## Aesthetic guidance

### Typography

- Use type choices with personality.
- Avoid generic defaults such as Inter, Arial, Roboto, and system-only stacks unless the product already depends on them.
- Pair a stronger display voice with a readable body voice when appropriate.
- Let typography carry hierarchy and brand character.

### Color and surfaces

- Commit to a clear palette and atmosphere.
- Prefer deliberate dominant tones and controlled accents.
- Avoid default purple-on-white or generic dashboard palettes.
- Make surfaces, borders, shadows, and background treatment part of the concept.

### Motion

- Describe motion where it helps the mockup feel alive.
- Focus on page-load mood, transitions, emphasis, and hover/focus personality.
- Do not turn the output into implementation instructions.

### Layout

- Avoid cookie-cutter Angular dashboard layouts unless the product actually calls for one.
- Use spacing, asymmetry, rhythm, sectioning, and contrast intentionally.
- Let the most important content or action own the composition.

### Detail and atmosphere

- Build atmosphere with texture, layering, subtle pattern, transparency, shadow, or framing when it supports the concept.
- Every decorative decision should still feel credible inside a real Angular application.

## Recommended output format

When helpful, structure the mockup output like this:

```md
# Angular App Mockups

## Design Direction

## App Shell Mockup

## Persons List Page Mockup

## Person Detail Page Mockup

## Create / Edit Form Mockup

## State Screens

## Visual System Notes
```

## Anti-patterns

Do not default to:
- generic Material demo aesthetics
- unstyled Angular Material screens
- bland card grids with no hierarchy
- interchangeable SaaS dashboards
- repeated trendy font choices across generations
- mockups that ignore the actual product purpose

## Working style

- If planning documents exist, use them as the conceptual base for the mockups.
- If architecture exists, align the visual composition with it.
- If the app already has a shell or theme, evolve it rather than resetting it.
- Make bold choices, but make them feel product-specific and intentional.
- Optimize for clarity, memorability, and decision support before implementation begins.
