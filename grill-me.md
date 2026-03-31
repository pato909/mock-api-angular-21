# Grill Me Summary

## Objective
Create an Angular 21 application named `People Directory` connected to:
[MockAPI persons](https://69ca6329ba5984c44bf30fe2.mockapi.io/api/v1/persons)

The goal is to build a modern, clean, maintainable V1 using recent Angular 21 capabilities while staying pragmatic about experimental APIs.

## Scope for V1
- persons list
- person detail
- create person
- update person
- delete person
- search
- sorting
- pagination
- `loading`, `error`, and `empty` states

## Technical decisions
- Use Angular 21.
- Use standalone APIs.
- Use `provideRouter`.
- Use lazy loading for routes/features.
- Use `signals` for local state.
- Use `inject()`.
- Use `ChangeDetectionStrategy.OnPush`.
- Do not use Signal Forms in V1.
- Keep Signal Forms for a potential V2.
- Use `httpResource()` for read flows when it fits.
- Use `HttpClient` for mutations.
- Stay pragmatic with experimental Angular APIs.

## Data strategy

### Reads
- `list` via `httpResource()`
- `detail` via `httpResource()`

### Mutations
- `create` via `HttpClient`
- `update` via `HttpClient`
- `delete` via `HttpClient`

### General approach
- Keep the data layer readable.
- Centralize list parameters.
- Refresh data after mutations.

## UI and UX decisions
- Use Angular Material.
- Use `MatTable` for the list.
- Use Angular Material across the app in a light, sober way.
- Build a professional, modern, clear, and restrained UI.
- Use a light Material 3 theme.
- Add a light custom CSS layer.
- Aim for accessibility and WCAG AA.
- Do not invest in a dedicated mobile UX for V1.

## Visual direction
- Light theme
- Professional neutral palette
- Material 3 base
- Custom CSS variables
- Clean, airy surfaces/cards
- Slightly tinted background
- Visible focus states
- Good contrast
- No Tailwind or extra CSS framework for V1

## Real MockAPI model observed
The endpoint currently returns:
- `id`
- `firstName`
- `lastName`
- `birthDate`
- `email`
- `phone`
- `avatar`
- `created_at`
- `updated_at`

## Data display decisions

### In the list
- show `avatar`
- show full name
- show `email`
- show `phone`
- show `birthDate`

### In the detail page
- show `id`
- show `created_at`
- show `updated_at`

### In create/edit forms
- editable: `firstName`, `lastName`, `birthDate`, `email`, `phone`, `avatar`

### Read-only backend fields
- `id`
- `created_at`
- `updated_at`

## Routing structure
- `/persons`
- `/persons/new`
- `/persons/:id`
- `/persons/:id/edit`

This structure was chosen because it is clear, REST-like, maintainable, and a good fit for Angular lazy loading.

## List behavior
The real MockAPI behavior was checked and supports:
- `search`
- `sortBy`
- `order`
- `page`
- `limit`

Chosen strategy:
- server-side search
- server-side sorting
- server-side pagination
- integrate with `MatTable`, `MatSort`, and `MatPaginator`
- use a single global search field
- use debounce for search
- default sort: `lastName` ascending

## Desktop table columns
- `Avatar`
- `Name`
- `Email`
- `Phone`
- `Birth date`
- `Actions`

### Visible row actions
- `View`
- `Edit`
- `Delete`

## Delete flow
- deletion can start from list or detail
- confirm with `MatDialog`
- execute delete via `HttpClient`
- show success/error snackbar
- refresh list after delete
- navigate back to `/persons` when delete is triggered from detail

## Form validation decisions
Validation level: robust but reasonable

Rules:
- `firstName` required, max `30`
- `lastName` required, max `30`
- `email` required, email format, max `60`
- `birthDate` required, valid date, not in the future
- `phone` required, max `30`
- `avatar` required, valid URL, max `256`
- trim text fields before submit
- use clear and accessible validation messages

## After create / update
- after `create`: success snackbar, then redirect to `/persons/:id`
- after `update`: success snackbar, then return to `/persons/:id`

## Project structure
Chosen approach: `feature-first`

Recommended structure:
- `app/core`
- `app/shared`
- `app/features/persons`

Inside `persons`:
- `data`
- `model`
- `pages`
- `ui`

## Tests
- no tests for now in V1

## Form navigation protection
- no unsaved-changes guard in V1
- users can leave create/edit pages without confirmation

## Global layout
- simple shell: `top app bar + content`
- no side navigation
- clear, compact, professional app bar
- centered content with a comfortable max width

## Application name
- `People Directory`

## Avatar behavior
- show image when it loads
- if loading fails, show initials fallback
- provide correct accessible alt text

## Detail page design
Richer detail page with:
- large avatar
- full name as title
- visible `Edit` and `Delete` actions at the top
- main information block with:
  - `email`
  - `phone`
  - `birthDate`
- secondary metadata block with:
  - `id`
  - `created_at`
  - `updated_at`

## Not found behavior
If `/persons/:id` or `/persons/:id/edit` points to a missing person:
- show a proper `Person not found` state
- provide a way back to `/persons`
- do not expose a raw technical error

## Loading and feedback behavior
- show a spinner or progress bar for global loading
- show a visible loading state on the list
- disable buttons during `create`, `update`, and `delete`
- provide clear `loading`, `empty`, and `error` states

## Options considered and final choices
- Latest Angular APIs everywhere: not for V1
- Signal Forms: postponed to V2
- Tailwind: rejected
- Client-side filtering/sorting/pagination: rejected
- Single HTTP approach for everything: rejected
- Sidenav layout: rejected
- Mobile-specific UX work: rejected for V1
- Unsaved-changes guard: rejected for V1

## Assumptions
- MockAPI is the main backend for V1.
- The dataset can grow, so server pagination is preferable from the start.
- A single global search is enough for V1.
- The target is a solid, credible foundation, not a full enterprise product.

## Risks
- `httpResource()` may fit read flows better than full CRUD.
- Material may feel generic without light customization.
- MockAPI may still have advanced limitations.
- No tests means code discipline matters more.
- External avatars may be broken or slow.
- No mobile-first UX limits V1 reach.
- No unsaved-changes guard can lead to lost input.
- CRUD scope can grow quickly without a simple architecture.

## Mitigations
- Restrict `httpResource()` to reads.
- Use `HttpClient` for mutations.
- Add a light custom CSS layer on top of Material.
- Keep routes and feature structure simple.
- Validate forms and handle states carefully.
- Keep logic isolated so tests are easy to add later.
- Provide avatar fallback.
- Use explicit loading and disabled-button states.
