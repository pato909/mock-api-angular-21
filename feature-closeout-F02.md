# Feature Closeout - F02

## Feature

`F02 - Material Theme and Shared UI Foundations`

GitHub issue:
[Issue #10](https://github.com/pato909/mock-api-angular-21/issues/10)

## Status

Validated locally.

The feature intent is satisfied:
- Angular Material is installed and used by the application shell and shared UI states
- the app now uses a light Material 3 theme with a light custom CSS layer
- shared visual tokens exist for spacing, surfaces, focus, radius, and layout width
- reusable `loading`, `empty`, and `error` state components are available in `app/shared/ui`
- the implementation compiles successfully with `npm run build`

## What Was Done

- Installed Angular Material and the related Angular animations package in the Angular app.
- Enabled Angular animations through `provideAnimationsAsync()`.
- Reworked the global stylesheet so the app foundation is now split between:
  - Material 3 theme variables
  - project-level CSS tokens for spacing, surfaces, borders, focus ring, shadows, and layout width
- Replaced the previous shell styling direction with a Material-based top bar and a cleaner app-level surface treatment.
- Added shared UI state components for:
  - loading
  - empty
  - error
- Wired the placeholder persons pages to showcase the shared foundations so the theme and state patterns are already visible before the CRUD flows are implemented.
- Verified that the Angular app builds successfully after the theming and shared UI changes.

## Key Decisions

- Angular Material is now the main component library for the shell and shared state patterns.
- The theme remains light-only for V1, aligned with the roadmap and architecture decisions.
- The custom CSS layer stays intentionally light and token-based rather than becoming a second design system beside Material.
- Shared state presentation is centralized in `app/shared/ui` so later list, detail, create, and edit flows can reuse the same UX language.
- Some follow-up Angular cleanup items identified during review are intentionally deferred to later work instead of being forced into the F02 scope.

## Files or Areas Affected

Main theme and shell work:
- [people-directory/package.json](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\package.json)
- [people-directory/src/styles.scss](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\styles.scss)
- [people-directory/src/app/app.config.ts](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\app.config.ts)
- [people-directory/src/app/app.ts](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\app.ts)
- [people-directory/src/app/app.html](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\app.html)
- [people-directory/src/app/app.scss](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\app.scss)

Shared UI foundations:
- [people-directory/src/app/shared/ui/loading-state/loading-state.ts](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\shared\ui\loading-state\loading-state.ts)
- [people-directory/src/app/shared/ui/empty-state/empty-state.ts](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\shared\ui\empty-state\empty-state.ts)
- [people-directory/src/app/shared/ui/error-state/error-state.ts](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\shared\ui\error-state\error-state.ts)

Placeholder route integration:
- [people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\features\persons\pages\persons-list-page\persons-list-page.ts)
- [people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\features\persons\pages\person-detail-page\person-detail-page.ts)
- [people-directory/src/app/features/persons/pages/person-create-page/person-create-page.ts](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\features\persons\pages\person-create-page\person-create-page.ts)
- [people-directory/src/app/features/persons/pages/person-edit-page/person-edit-page.ts](C:\Users\ALM\.codex\worktrees\4d0d\mock-api-angular-21\people-directory\src\app\features\persons\pages\person-edit-page\person-edit-page.ts)

## What To Verify

- The shell renders with the Material-based top bar and centered content area.
- Global focus states are visible on interactive elements.
- The shared `loading`, `empty`, and `error` components render correctly and remain visually consistent.
- The app still builds successfully with `npm run build`.
- The light theme remains readable and maintains good contrast on the main surfaces.

## Pull Request Status

No pull request was found for `F02`.

The only recent feature PR visible in the repository is the merged PR for `F01`:
- [PR #12](https://github.com/pato909/mock-api-angular-21/pull/12) `F01: implement app shell and routing foundation`

PR creation is currently blocked from this closeout because:
- the current work is not represented by a detected `F02` pull request
- repository git inspection is blocked locally by the current safe-directory ownership configuration
- this closeout request did not include a separate commit/push/PR step

Before opening the PR for `F02`, the next Git steps should be:
- confirm the feature branch state locally
- commit the F02 changes
- push the branch
- open a PR aligned with the roadmap wording for `F02`

## Follow-ups or Deferred Work

- Review items intentionally deferred after validation:
  - inert placeholder actions in the shell and state showcase
  - restoring an explicit semantic header landmark around the toolbar
  - lazy loading at route boundaries
- These follow-ups do not block the F02 theme and shared UI foundation itself, but they should be addressed in later cleanup or adjacent feature work.
