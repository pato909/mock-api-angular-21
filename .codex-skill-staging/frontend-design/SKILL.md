---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use when Codex needs to build web components, pages, or full applications with a strong aesthetic point of view, polished implementation, and creative frontend decisions that avoid generic AI-looking design.
---

# Frontend Design

Create distinctive, production-grade frontend interfaces that feel intentionally designed rather than generic.

## Core goal

- Build real working frontend code.
- Aim for exceptional visual quality and cohesion.
- Avoid generic "AI slop" aesthetics.
- Match the implementation to a clear visual concept.

## Design thinking first

Before coding, identify and commit to a strong design direction.

Always reason about:
- purpose
- audience
- tone
- technical constraints
- what makes the interface memorable

Choose a bold aesthetic direction and execute it consistently. Good directions include:
- brutally minimal
- maximalist
- retro-futuristic
- organic
- luxury
- playful
- editorial
- brutalist
- art deco
- soft/pastel
- industrial

These are inspiration points, not templates. The important part is a clear point of view and precise execution.

## Output expectations

The implementation should be:
- production-grade
- functional
- visually striking
- cohesive
- refined in detail

Do not stop at visual ideas. Produce working code in the requested stack.

## Aesthetic guidelines

### Typography

- Choose fonts with character.
- Pair a strong display font with a refined body font when appropriate.
- Avoid generic fonts such as Arial, Inter, Roboto, and default system stacks unless the project already requires them.
- Use typography as a primary design tool, not just a content container.

### Color and theme

- Commit to a coherent palette and visual atmosphere.
- Use CSS variables for color consistency.
- Prefer dominant colors with intentional accents over timid, evenly distributed palettes.
- Vary themes between outputs; do not converge on the same defaults repeatedly.

### Motion

- Use animations deliberately.
- Focus on high-impact moments such as page-load reveals, staged transitions, hover moments, and scroll-triggered effects.
- Prefer CSS-only motion for HTML when possible.
- Use a motion library in React when available and appropriate.
- Match motion intensity to the chosen aesthetic.

### Spatial composition

- Prefer layouts with intentional personality.
- Use asymmetry, overlap, negative space, or controlled density when it supports the concept.
- Avoid predictable boilerplate component stacking unless the project already demands it.

### Backgrounds and detail

- Build atmosphere, not just content boxes.
- Use effects that fit the concept, such as:
  - gradient meshes
  - grain
  - subtle noise
  - geometric patterns
  - layered transparencies
  - strong shadows
  - decorative borders
  - custom cursors
- Every decorative choice must support the visual direction.

## Anti-patterns

Never default to:
- purple gradients on white backgrounds
- overused AI-looking font choices
- cookie-cutter SaaS layouts
- interchangeable card grids with no visual point of view
- generic spacing and safe-but-bland component styling
- repetitive design choices across outputs

Do not let every design drift toward the same trendy defaults.

## Complexity guidance

- Match implementation complexity to the design direction.
- Maximalist concepts should include richer motion, layering, and detail.
- Minimalist concepts should express quality through restraint, spacing, hierarchy, and precision.
- Do not overbuild a calm design, and do not underbuild an expressive one.

## Technical quality

- Keep the output production-grade, not just visually ambitious.
- Preserve accessibility requirements from the project context.
- Ensure the interface remains usable and coherent across realistic screen sizes unless the user explicitly narrows the target.
- Respect the repository's framework and conventions when working inside an existing codebase.

## Working style

- Interpret requirements creatively.
- Make unexpected but intentional choices.
- Vary your visual language from project to project.
- Build interfaces that feel designed for the specific context and audience.
- Optimize for memorability without sacrificing usability.
