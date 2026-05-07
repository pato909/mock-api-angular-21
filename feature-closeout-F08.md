# Feature Closeout - F08

## Feature

`F08 - Delete Confirmation and Mutation Feedback`

GitHub issue:
[Issue #6](https://github.com/pato909/mock-api-angular-21/issues/6)

## Status

Validated locally.

The delete flow is now implemented from both the persons list and person detail routes. Delete actions require a Material confirmation dialog, show mutation feedback through snackbars, refresh list data after successful deletion, and return the user to `/persons` after deleting from the detail page.

Validation commands:

```text
npm test
npm run build
```

Result:
- tests succeeded: `2` tests passed
- build succeeded
- Angular budget warning remains: initial bundle exceeds the configured `500 kB` budget

## What Was Done

- Added a reusable `DeletePersonDialog` component under the persons feature UI folder.
- Wired delete actions into both the persons list and person detail views.
- Required confirmation through `MatDialog` before calling the delete endpoint.
- Reused `PersonsApiService.delete(...)` for the imperative delete mutation.
- Added success snackbar feedback after a successful delete.
- Added error snackbar feedback after a failed delete.
- Added a detail-page `isDeleting` signal so the destructive action is disabled while the delete request is in flight.
- Ensured `isDeleting` is set only after confirmation and reset with `finalize(...)`.
- Redirected from the detail page back to `/persons` after a successful delete.
- Added list and count reload hooks to `PersonsResources` so list rows and paginator length refresh after deletion.
- Updated the root app spec so the test suite verifies the current application shell instead of the old generated Angular title.

## Key Decisions

- Kept the confirmation dialog specific to the persons feature instead of promoting it to `shared/ui`, because the dialog copy and data shape are person-specific.
- Kept mutation orchestration inside the page components, matching the existing create and edit flows.
- Used `HttpClient` through `PersonsApiService` for delete because it is an imperative mutation rather than declarative resource loading.
- Used `httpResource().reload()` through `PersonsResources` to refresh reads after the mutation.
- Used native `button` elements for destructive actions so the UI remains keyboard-accessible and semantically correct.

## Files or Areas Affected

- [feature-closeout-F08.md](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/feature-closeout-F08.md)
- [people-directory/src/app/features/persons/ui/delete-person-dialog/delete-person-dialog.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/ui/delete-person-dialog/delete-person-dialog.ts)
- [people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts)
- [people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts)
- [people-directory/src/app/features/persons/data/persons-resources.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/data/persons-resources.ts)
- [people-directory/src/app/app.spec.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.spec.ts)

## What To Verify

- `/persons` shows a delete action for each listed person.
- Clicking delete from the list opens the confirmation dialog.
- Cancelling the dialog does not call the delete endpoint.
- Confirming the dialog deletes the person and shows a success snackbar.
- A failed delete from the list shows an error snackbar.
- The list rows and paginator count refresh after a successful delete.
- `/persons/:id` shows a delete action on the person detail page.
- Deleting from the detail page opens the same confirmation dialog.
- The detail delete button is disabled only while the confirmed delete request is in flight.
- A successful detail delete shows a success snackbar and redirects to `/persons`.
- A failed detail delete shows an error snackbar and leaves the user on the detail page.

## Pull Request Status

No F08 pull request exists yet.

Current blocker:
- the repository is still on `main`
- the F08 work and closeout are local, uncommitted changes
- no feature branch has been pushed for this closeout yet

Recommended branch name:
`codex/f08-delete-confirmation-feedback`

## GitHub Sync

- Matching issue confirmed: [Issue #6](https://github.com/pato909/mock-api-angular-21/issues/6)
- Completion summary posted to the issue.
- Posted comment id: `4398248357`

## Follow-ups or Deferred Work

- The Angular initial bundle budget warning remains and should be handled separately from F08.
- Broader loading, empty, error, and not-found polish remains part of `F10`.
- Avatar fallback robustness remains part of `F09`.
