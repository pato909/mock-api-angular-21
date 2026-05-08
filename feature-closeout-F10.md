# Feature Closeout - F10

## Feature

`F10 - Loading, Empty, Error, and Not-Found Polish`

GitHub issue:
[Issue #3](https://github.com/pato909/mock-api-angular-21/issues/3)

## Status

Validated locally.

The non-happy-path experience is now more consistent across the persons list, detail, create, edit, and delete flows. Loading, empty, error, not-found, and in-flight mutation states use clearer user-facing wording and avoid raw technical failure details.

Validation commands:

```text
npm test -- --watch=false
npm run build
npx prettier --check "src/app/shared/ui/{loading-state,empty-state,error-state}/*.ts" "src/app/features/persons/pages/{persons-list-page,person-detail-page,person-create-page,person-edit-page}/*.ts" "src/app/features/persons/ui/person-form/*.ts"
```

Result:
- tests passed: `1` test file, `2` tests
- build succeeded
- formatting check passed
- Angular budget warning remains: initial bundle exceeds the configured `500 kB` budget

## What Was Done

- Localized the default shared loading, empty, and error state component copy to match the French application UI.
- Standardized snackbar copy and actions for create, update, and delete success or failure states.
- Added duplicate-submit guards to create, edit, form submit, and detail delete flows.
- Added row-level in-flight delete feedback on the persons list.
- Replaced the persons list retry behavior with explicit resource reloads.
- Kept not-found states distinct from generic error states on detail and edit routes.
- Corrected the edit page form section labelling so the section id matches the edit context.
- Cleaned up small form wording inconsistencies around telephone, avatar URL, and submit progress.

## Key Decisions

- Kept shared state components generic and reusable while giving their defaults application-consistent French copy.
- Used local signals for mutation state because the in-flight behavior is page-local and does not require a wider store.
- Kept list delete locking scoped to the active row instead of disabling the whole table, preserving simple browsing during a single delete mutation.
- Kept page-level fetch errors inline with retry actions, and mutation errors as snackbars that preserve the current page context.
- Avoided exposing raw HTTP or API error messages to users.

## Files or Areas Affected

- [people-directory/src/app/shared/ui/loading-state/loading-state.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/shared/ui/loading-state/loading-state.ts)
- [people-directory/src/app/shared/ui/empty-state/empty-state.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/shared/ui/empty-state/empty-state.ts)
- [people-directory/src/app/shared/ui/error-state/error-state.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/shared/ui/error-state/error-state.ts)
- [people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts)
- [people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts)
- [people-directory/src/app/features/persons/pages/person-create-page/person-create-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-create-page/person-create-page.ts)
- [people-directory/src/app/features/persons/pages/person-edit-page/person-edit-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-edit-page/person-edit-page.ts)
- [people-directory/src/app/features/persons/ui/person-form/person-form.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/ui/person-form/person-form.ts)

## What To Verify

- `/persons` shows a clear loading state while list data loads.
- `/persons` shows a clear empty state when no records are available or no search results match.
- `/persons` shows an inline error state with a retry action when list loading fails.
- `/persons/:id` and `/persons/:id/edit` keep not-found separate from generic errors.
- Create and edit submit buttons are disabled while mutations are in progress and cannot double-submit.
- Delete actions cannot be triggered repeatedly while the delete mutation is in progress.
- Create, update, and delete snackbars use clear user-facing French messages.

## Pull Request Status

Pending publication.

## GitHub Sync

- Matching issue confirmed: [Issue #3](https://github.com/pato909/mock-api-angular-21/issues/3)
- Completion summary prepared for issue sync.

## Follow-ups or Deferred Work

- The Angular initial bundle budget warning remains and should be handled separately from F10.
- A broader final accessibility and keyboard interaction pass remains part of `F11`.
