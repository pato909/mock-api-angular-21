# Feature Closeout - F07

## Feature

`F07 - Person Edit Form`

GitHub issue:
[Issue #7](https://github.com/pato909/mock-api-angular-21/issues/7)

## Status

Validated locally.

The edit flow is now implemented at `/persons/:id/edit` with route-driven data loading, shared form reuse, update submission, not-found handling, and post-update navigation back to the person detail page.

Validation command:

```text
npm run build
```

Result:
- build succeeded
- Angular budget warning remains: initial bundle exceeds the configured `500 kB` budget

## What Was Done

- Replaced the edit-page placeholder with a real edit screen aligned with the existing persons page structure.
- Reused the shared `PersonForm` component for edit instead of duplicating form controls and validation rules.
- Added edit-mode form prefill from the current person detail resource.
- Added a dynamic form submit label so the shared form displays create/edit wording correctly.
- Preserved the agreed validation rules from create:
  - required fields
  - max length limits
  - email format
  - birth date not in the future
  - avatar URL validity
  - phone required and max `30`, with no phone format validation in V1
- Avoided wiping user edits by initializing the edit form only once per loaded person id.
- Wired the edit page to `PersonsApiService.update(...)`.
- Disabled submit while the update request is in progress.
- Added success and failure snackbar feedback for update.
- Navigated back to `/persons/:id` after a successful update.
- Added explicit loading, error, retry, and not-found states to the edit route.
- Added a detail-resource reload hook so the detail page can show fresh data after an update.

## Key Decisions

- Kept `PersonForm` as a reusable UI component that owns form state, validation, normalization, and payload emission.
- Kept update orchestration in `PersonEditPage`, matching the create-page pattern where the route container owns the mutation and navigation.
- Used the route `id` from `withComponentInputBinding()` for update requests instead of relying on hard-coded ids.
- Kept phone validation intentionally light for V1: required plus max length only.
- Centralized persons read resources behind `PersonsResources` and added explicit reload behavior for detail reads after mutation.

## Files or Areas Affected

- [feature-closeout-F07.md](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/feature-closeout-F07.md)
- [people-directory/src/app/features/persons/pages/person-edit-page/person-edit-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-edit-page/person-edit-page.ts)
- [people-directory/src/app/features/persons/ui/person-form/person-form.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/ui/person-form/person-form.ts)
- [people-directory/src/app/features/persons/data/persons-resources.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/data/persons-resources.ts)
- [people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts)
- [people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts)
- [grill-me.md](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/grill-me.md)
- [angular-architecture.md](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/angular-architecture.md)
- [feature-closeout-F06.md](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/feature-closeout-F06.md)

## What To Verify

- `/persons/:id/edit` renders the edit page for an existing person.
- The form is prefilled with the selected person's current data.
- Editing and submitting sends the current route id to the update endpoint.
- Submit is disabled while the update request is in flight.
- A successful update shows a success snackbar and redirects to `/persons/:id`.
- The detail page shows fresh data after returning from edit.
- A failed update shows an update-specific error snackbar and keeps the user on the edit page.
- A missing person id shows the `Person not found` state and a path back to `/persons`.
- A failed read shows the inline error state and supports retry.
- Phone accepts any non-empty value up to `30` characters without format validation.

## Pull Request Status

No pull request was identified from this local closeout or from a GitHub PR search for F07.

PR creation is not included in the local validation yet because:
- the repository is currently on `main`
- the F07 work is still uncommitted
- the working tree also contains documentation alignment changes related to the phone validation decision

Before opening a PR for `F07`, the next Git steps should be:
- confirm the intended branch strategy for the edit-form work
- stage the intended F07 and documentation changes
- commit the validated changes
- push a feature branch
- open a PR aligned with `F07 - Person Edit Form`

## GitHub Sync

- Matching issue confirmed: [Issue #7](https://github.com/pato909/mock-api-angular-21/issues/7)
- Completion summary posted to the issue.
- Posted comment id: `4394481881`

## Follow-ups or Deferred Work

- The Angular initial bundle budget warning remains and should be handled separately from F07.
- Delete behavior remains part of `F08 - Delete Confirmation and Mutation Feedback`.
- Broader loading/error/not-found polish remains part of `F10`.
- Avatar fallback robustness remains part of `F09`.
