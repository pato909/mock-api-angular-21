# Feature Closeout - F04

## Feature

F04 - Persons List Page with Server-Side Search, Sort, and Pagination

## Status

Validated with one known implementation caveat.

The main feature intent is satisfied:

- the `/persons` route now renders a real persons list page instead of the earlier F02 placeholder
- the list is displayed with an Angular Material table
- global search is debounced and updates the server-side query state
- sorting is server-side and defaults to `lastName` ascending
- pagination is wired through `MatPaginator`
- loading, empty, and error states are present and actionable

## What Was Done

- Replaced the placeholder persons list page with a real list experience.
- Added a signal-based query state for `search`, `sortBy`, `order`, `page`, and `limit`.
- Connected the list page to the existing `PersonsResources.personsList()` `httpResource()` read flow.
- Added debounced search using a local `searchInput` signal and a synchronization effect.
- Added server-side sort handling with UI-to-API mapping for the `name` column to `lastName`.
- Added a Material table with avatar, full name, email, phone, birth date, and actions columns.
- Added Material paginator wiring for page index, page size, and total length.
- Added a clear-search action and contextual empty-state behavior.
- Added retry and create-first-person actions to the page states.
- Adjusted global focus styling so Angular Material inputs do not receive a duplicate custom focus ring.

## Key Decisions

- The list page owns the query state locally with Angular signals rather than using a global store.
- The search input is separated from the API query state so the API query only updates after debounce.
- The `name` table column remains a UI concept, while the API sort field remains `lastName`.
- The page uses the shared loading, empty, and error state components created earlier in the project.
- The UI copy on this page is now consistently in French.

## Files or Areas Affected

- `people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts`
- `people-directory/src/app/features/persons/data/persons-resources.ts`
- `people-directory/src/styles.scss`

## What To Verify

- `/persons` loads the list table by default.
- Search waits for the debounce delay before updating the server-side query.
- Clearing search resets the search input and query.
- Sorting by name maps to `lastName` and can toggle between ascending and descending order.
- Sorting by email, phone, and birth date updates the server-side query.
- Pagination updates the page and page size used by the server-side query.
- Empty state copy changes depending on whether a search is active.
- Error state retry reissues the current query.
- The create actions navigate to `/persons/new`.

## Follow-ups or Deferred Work

- The paginator `length` is currently backed by `countPersons()`, which fetches matching persons with a large `limit: 100000` and derives the total from the returned array length.
- This is acceptable as a training-project compromise for F04, but it is not a scalable production-grade count strategy.
- If MockAPI exposes a reliable total-count header or count endpoint later, `countPersons()` should be replaced with that source so the paginator length stays accurate without fetching a large result set.
- Avatar broken-image fallback remains intentionally deferred to F09.
- Delete actions are intentionally deferred to F08.
