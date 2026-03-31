# Features Roadmap

This roadmap turns the agreed V1 scope from [grill-me.md](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/grill-me.md) into an ordered delivery plan.

The sequencing logic is:
- establish the Angular 21 shell and shared foundations first
- build the persons data layer before user-facing pages
- deliver the list flow before detail and forms
- add destructive flows and edge states after the main CRUD path exists
- finish with polish and consistency work that depends on the earlier slices

## F01 - Angular App Shell and Feature-First Structure

**Description**  
Create the Angular 21 application shell, top app bar layout, routing foundation, and feature-first project structure required to host the persons feature cleanly.

**Acceptance Criteria**
- The app boots with a top app bar and centered content area.
- The application is organized with `app/core`, `app/shared`, and `app/features/persons`.
- Routes exist for `/persons`, `/persons/new`, `/persons/:id`, and `/persons/:id/edit`.
- The shell displays the application name `People Directory`.
- The shell uses standalone Angular APIs and `provideRouter`.

**Estimate**  
M

## F02 - Material Theme and Shared UI Foundations

**Description**  
Set up Angular Material, the agreed light Material 3 visual direction, shared CSS variables, and reusable UI patterns for loading, empty, and error states.

**Acceptance Criteria**
- Angular Material is configured and used as the main component library.
- The UI uses a light Material 3 theme with a light custom CSS layer.
- Shared visual tokens exist for spacing, surfaces, focus, and core colors.
- Reusable loading, empty, and error presentation patterns are available.
- The resulting foundation supports accessible contrast and visible focus states.

**Estimate**  
M

## F03 - Persons Domain Model and Data Access Layer

**Description**  
Implement the `persons` domain model, typed API integration, list query state, and read/write data flows using `httpResource()` for reads and `HttpClient` for mutations.

**Acceptance Criteria**
- The `Person` model reflects the real MockAPI payload.
- List reads use `httpResource()` with support for `search`, `sortBy`, `order`, `page`, and `limit`.
- Detail reads use `httpResource()` for `/persons/:id`.
- `create`, `update`, and `delete` use `HttpClient`.
- The data layer exposes a clear way to refresh reads after mutations.

**Estimate**  
L

## F04 - Persons List Page with Server-Side Search, Sort, and Pagination

**Description**  
Build the main persons list page using `MatTable`, backed by the server-side query capabilities provided by MockAPI.

**Acceptance Criteria**
- The list page is available at `/persons`.
- The table shows `Avatar`, `Name`, `Email`, `Phone`, `Birth date`, and `Actions`.
- Search is global, server-side, and uses debounce.
- Sorting is server-side and defaults to `lastName` ascending.
- Pagination is server-side and wired to `MatPaginator`.
- The page shows clear loading, empty, and error states.

**Estimate**  
L

## F05 - Person Detail Page

**Description**  
Create the richer person detail view with primary profile information, secondary metadata, and direct actions to edit or delete the current record.

**Acceptance Criteria**
- The detail page is available at `/persons/:id`.
- The page shows a large avatar, full name, email, phone, and birth date.
- The page shows `id`, `created_at`, and `updated_at` in a secondary metadata section.
- Visible actions exist for `Edit` and `Delete`.
- If the record does not exist, the page shows a proper `Person not found` state with a path back to `/persons`.

**Estimate**  
M

## F06 - Person Create Form

**Description**  
Implement the create flow with a reactive form, robust but reasonable validation rules, submission feedback, and post-create navigation.

**Acceptance Criteria**
- The create page is available at `/persons/new`.
- The form includes `firstName`, `lastName`, `birthDate`, `email`, `phone`, and `avatar`.
- Validation rules match the agreed limits and behaviors from `grill-me.md`.
- Text fields are trimmed before submission.
- Submit actions are disabled while the create request is in progress.
- On success, the app shows a snackbar and redirects to `/persons/:id`.

**Estimate**  
L

## F07 - Person Edit Form

**Description**  
Implement the edit flow by reusing the person form behavior for an existing record and supporting not-found handling and post-update navigation.

**Acceptance Criteria**
- The edit page is available at `/persons/:id/edit`.
- The form is prefilled from the current person data.
- The same validation and submit rules as create are applied.
- Submit actions are disabled while the update request is in progress.
- On success, the app shows a snackbar and returns to `/persons/:id`.
- If the record does not exist, the page shows a proper `Person not found` state.

**Estimate**  
M

## F08 - Delete Confirmation and Mutation Feedback

**Description**  
Add the agreed delete experience, including confirmation dialog, mutation feedback, and refresh/navigation behavior from both list and detail entry points.

**Acceptance Criteria**
- A delete action is available from both the list and detail views.
- Deleting a person always requires a `MatDialog` confirmation.
- A successful delete shows a success snackbar.
- A failed delete shows an error snackbar.
- Deleting from the detail page redirects back to `/persons`.
- The list reflects deletions without requiring a full manual reload.

**Estimate**  
M

## F09 - Avatar Fallback and Display Robustness

**Description**  
Ensure avatar rendering is resilient by handling broken external image URLs and maintaining accessible output across list and detail views.

**Acceptance Criteria**
- Avatar images display correctly when the remote URL loads.
- Broken or unavailable avatar URLs fall back to initials.
- The list and detail pages both use the fallback behavior consistently.
- Avatar output includes meaningful accessible text.

**Estimate**  
S

## F10 - Loading, Empty, Error, and Not-Found Polish

**Description**  
Unify the non-happy-path experience across list, detail, create, edit, and delete interactions so the application feels coherent and predictable.

**Acceptance Criteria**
- Global and page-level loading feedback follows a consistent pattern.
- Empty states are explicit and user-friendly.
- Error states are clear and do not expose raw technical failures.
- Not-found handling is consistent for detail and edit routes.
- Buttons and actions are correctly disabled during in-flight mutations.

**Estimate**  
M

## F11 - Accessibility and Interaction Pass

**Description**  
Review and refine the implemented flows to meet the agreed accessibility standard and ensure the UI remains clear, keyboard-friendly, and consistent.

**Acceptance Criteria**
- Core flows support keyboard navigation.
- Focus states remain visible throughout the app.
- Forms expose accessible validation messaging.
- Table and actions remain understandable to assistive technologies.
- The app is aligned with the agreed WCAG AA target for this V1 scope.

**Estimate**  
M

## Assumptions and Dependencies
- `F01` and `F02` should land before the main feature pages.
- `F03` is a dependency for `F04`, `F05`, `F06`, `F07`, and `F08`.
- `F06` and `F07` may share a common form UI component inside `app/features/persons/ui`.
- `F08`, `F09`, `F10`, and `F11` depend on the core CRUD flows already existing.
- Estimates use the relative scale `XS`, `S`, `M`, `L`, `XL`.
