# Feature Closeout - F01

## Feature

`F01 - App Shell and Routing`

GitHub issue:
[Issue #1](https://github.com/pato909/mock-api-angular-21/issues/1)

## Status

Validated locally.

The feature intent is satisfied:
- the Angular 21 application exists
- the root component now acts as the app shell
- the shell displays the application identity for `People Directory`
- the main feature-first structure is in place
- the main persons routes exist

## What Was Done

- Created the Angular 21 application in the `people-directory/` folder.
- Kept the project on standalone Angular APIs with router configuration through `provideRouter`.
- Replaced the default root content with a real application shell:
  - top app bar
  - brand area
  - global `New person` action
  - routed content area
- Added the main application routing:
  - `/persons`
  - `/persons/new`
  - `/persons/:id`
  - `/persons/:id/edit`
- Added a redirect from the empty route to `persons`.
- Created the initial feature-first folder structure:
  - `src/app/core`
  - `src/app/shared`
  - `src/app/features/persons`
- Added placeholder page components for the four persons routes.
- Fixed the shell styling so the app-level layout renders correctly.

## Key Decisions

- The root app component is used as the global shell, not as a feature page.
- The route root redirects to `/persons` instead of exposing multiple equivalent entry URLs.
- The feature-first project structure starts early, even while route pages are still placeholders.
- The global `New person` action is attached to the shell because it is part of the app-level navigation model.

## Files or Areas Affected

Main implementation work lives under:
- [people-directory/src/app/app.routes.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.routes.ts)
- [people-directory/src/app/app.html](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.html)
- [people-directory/src/app/app.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.ts)
- [people-directory/src/app/app.scss](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.scss)
- [people-directory/src/app/app.config.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.config.ts)

Feature placeholders and structure:
- [people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts)
- [people-directory/src/app/features/persons/pages/person-create-page/person-create-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-create-page/person-create-page.ts)
- [people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts)
- [people-directory/src/app/features/persons/pages/person-edit-page/person-edit-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-edit-page/person-edit-page.ts)

## What To Verify

- The app starts correctly.
- The shell is visible on every route.
- Navigating to `/persons`, `/persons/new`, `/persons/:id`, and `/persons/:id/edit` renders the expected placeholder page.
- Clicking `New person` in the shell navigates to `/persons/new`.

## Pull Request Status

No pull request exists yet for `F01`.

PR creation is currently blocked because:
- the active branch is still `main`
- the feature work inside `people-directory/` is not yet committed
- the work has not been pushed on a dedicated feature branch

Before creating the PR, the next Git steps should be:
- create or switch to a feature branch
- commit the `people-directory/` work related to `F01`
- push the branch
- open the PR against the repository default branch

## Follow-ups or Deferred Work

- The persons pages are still placeholders and are expected to be expanded in later features.
- Lazy loading is still a follow-up item if the implementation wants to align even more closely with the architecture plan.
- Shared UI foundations and theme consolidation belong to `F02`, not `F01`.
