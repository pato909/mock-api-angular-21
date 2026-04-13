# Feature Closeout - F05

## Feature

F05 - Person Detail Page

## Status

Validated.

The main feature intent is satisfied:

- the `/persons/:id` route renders a real person detail page instead of the earlier placeholder
- the detail view reads the route id through Angular component input binding
- the page loads the current person through the existing `PersonsResources.personDetail()` `httpResource()` read flow
- primary profile information and secondary metadata are displayed
- loading, error, and not-found states are handled with the shared state components

## What Was Done

- Replaced the person detail placeholder with a connected detail view.
- Enabled router component input binding so the `:id` route parameter can feed the page as a signal input.
- Connected the page to the existing detail resource read flow.
- Added a profile hero with a large avatar, full name, email, and visible edit/delete actions.
- Added a primary information section for email, phone, and birth date.
- Added a metadata section for `id`, `created_at`, and `updated_at`.
- Added a dedicated `Personne introuvable` state for missing records, with a return action to `/persons`.
- Added generic loading and error states for the detail read flow.
- Consolidated repeated page surface and info-card styles into the global stylesheet so list and detail share the same visual primitives.

## Key Decisions

- The detail page uses `input.required<string>()` together with router component input binding rather than manually reading `ActivatedRoute`.
- The page keeps detail loading independent from the list page so direct navigation to `/persons/:id` remains a first-class flow.
- The edit action navigates to `/persons/:id/edit` using the current person id.
- The delete action is visible but disabled for this feature, because the confirmation dialog and mutation feedback are intentionally deferred to F08.
- Shared layout primitives such as `page-panel`, `page-info-grid`, and `page-info-card` now live in `styles.scss` so list and detail do not duplicate those rules.

## Files or Areas Affected

- `people-directory/src/app/app.config.ts`
- `people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts`
- `people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts`
- `people-directory/src/styles.scss`

## What To Verify

- `/persons/:id` loads the detail view for an existing person.
- The page shows a large avatar, full name, email, phone, and birth date.
- The metadata section shows `id`, `created_at`, and `updated_at`.
- The edit action routes to `/persons/:id/edit` for the current person.
- The delete action is visible but remains disabled until F08.
- A missing person id shows the `Personne introuvable` state.
- The not-found state action returns to `/persons`.
- Retry from the generic error state reissues the detail read.

## Follow-ups or Deferred Work

- The actual delete confirmation and mutation feedback remain deferred to F08.
- Broken avatar fallback remains deferred to F09.
- Broader loading/error/not-found polish across routes remains deferred to F10.
- The initial Angular bundle still exceeds the configured budget during build; this is not specific to F05.
