# Feature Closeout - F06

## Feature

`F06 - Person Create Form`

GitHub issue:
[Issue #5](https://github.com/pato909/mock-api-angular-21/issues/5)

## Status

Validated locally.

The create flow is now implemented at `/persons/new` with a reusable reactive form, create-page orchestration, submission feedback, and redirect-on-success behavior.

## What Was Done

- Replaced the create-page placeholder with a real create screen aligned with the existing list/detail visual language.
- Added a reusable `PersonForm` component in `app/features/persons/ui`.
- Implemented reactive form controls for:
  - `firstName`
  - `lastName`
  - `phone`
  - `email`
  - `birthDate`
  - `avatar`
- Added validation and feedback for:
  - required fields
  - max length limits
  - email format
  - birth date not in the future
  - invalid typed birth date parsing
  - avatar URL validity
- Trimmed text fields before emitting the final payload.
- Added `isSubmitting` handling so submit is disabled while the create request is in progress.
- Wired the create page to `PersonsApiService.create(...)`.
- Added snackbar feedback for create success and create failure.
- Redirected to `/persons/:id` after a successful create.
- Added a custom date adapter and app-level Material date configuration so the birth date behaves with the expected `dd/MM/yyyy` display/parsing.
- Added shared validators for date and URL checks to keep the form logic focused.

## Key Decisions

- Kept the API call in `PersonCreatePage` and kept `PersonForm` focused on form state, validation, and payload emission so the same component can be reused for F07.
- Used `HttpClient` mutation flow through the existing `PersonsApiService` rather than forcing this into a resource-style abstraction.
- Added a stricter phone format validator than the original F06 wording required. This is intentionally documented in the form code as a deliberate validation choice rather than an accidental divergence.
- Added a custom Material date adapter so typed dates and picker-selected dates both align with the intended local `dd/MM/yyyy` UX and do not shift by one day when serialized.

## Files or Areas Affected

- [feature-closeout-F06.md](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/feature-closeout-F06.md)
- [people-directory/src/app/features/persons/pages/person-create-page/person-create-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-create-page/person-create-page.ts)
- [people-directory/src/app/features/persons/ui/person-form/person-form.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/ui/person-form/person-form.ts)
- [people-directory/src/app/features/persons/model/person-form.model.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/model/person-form.model.ts)
- [people-directory/src/app/shared/validators/date.validators.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/shared/validators/date.validators.ts)
- [people-directory/src/app/shared/validators/url.validators.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/shared/validators/url.validators.ts)
- [people-directory/src/app/shared/date/app-date-adapter.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/shared/date/app-date-adapter.ts)
- [people-directory/src/app/app.config.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.config.ts)

## What To Verify

- `/persons/new` renders the create page and form correctly.
- A valid create request submits once, disables the button while in flight, shows a success snackbar, and redirects to `/persons/:id`.
- A failed create request shows an error snackbar and re-enables submit.
- Typed dates in `dd/MM/yyyy` format are parsed correctly.
- Invalid typed dates show a user-facing validation message.
- Avatar values reject invalid URLs and accept valid `http`/`https` URLs.
- Text values are trimmed before the payload is sent.

## Pull Request Status

No pull request was identified for `F06` from this closeout.

PR creation is currently blocked because:
- the repository is still in a locally modified state
- the current branch is `codex/f05-person-detail-page`, which does not clearly represent isolated F06 work
- no commit/push/PR step was requested as part of this closeout

Before opening a PR for `F06`, the next Git steps should be:
- confirm the intended branch strategy for the create-form work
- stage and commit the validated F06 changes
- push the branch
- open a PR aligned with `F06 - Person Create Form`

## Follow-ups or Deferred Work

- The stricter phone-pattern validation is intentionally kept even though the original F06 wording only required `required + max 30`.
- F07 should reuse `PersonForm` for the edit flow rather than duplicating field and validation logic.
- The current closeout is based on local validated work; GitHub sync and PR creation still depend on repository/network access.
