# Feature Closeout - F09

## Feature

`F09 - Avatar Fallback and Display Robustness`

GitHub issue:
[Issue #2](https://github.com/pato909/mock-api-angular-21/issues/2)

## Status

Validated locally.

Avatar rendering is now resilient across the persons list and person detail pages. Valid remote avatar URLs render as images, while broken or unavailable URLs fall back to initials with accessible labeling.

Validation command:

```text
npm run build
```

Result:
- build succeeded
- Angular budget warning remains: initial bundle exceeds the configured `500 kB` budget

Manual validation:
- valid avatar URLs render as images in the persons list
- broken avatar URLs fall back to initials in the persons list
- broken avatar URLs fall back to large initials on the person detail page
- replacing a broken avatar URL with a valid URL retries the image instead of keeping the stale fallback

## What Was Done

- Added a reusable persons feature UI component for avatar rendering.
- Replaced direct `<img>` avatar rendering in the persons list with the reusable avatar component.
- Replaced direct `<img>` avatar rendering in the person detail header with the same reusable component.
- Added initials fallback behavior for broken remote avatar URLs.
- Tracked failed avatar URLs locally so a new avatar URL is retried automatically.
- Added accessible labeling for both successful image rendering and initials fallback rendering.
- Preserved list and detail visual variants through a small `variant` input.
- Removed duplicated avatar styling from the list and detail page components.
- Kept the avatar component aligned with Angular 21 conventions using standalone imports, signal inputs, computed state, local signals, and `ChangeDetectionStrategy.OnPush`.

## Key Decisions

- Kept avatar display inside `features/persons/ui` because it is a cross-page concern for the persons domain, not a global shared primitive.
- Passed only the fields needed by the component (`avatar`, `firstName`, `lastName`) instead of coupling the component to the full `Person` model.
- Used a local `failedAvatarUrl` signal plus a computed `imageFailed` value instead of an effect that writes to another signal.
- Used a `variant` input for list and detail sizing rather than creating separate list and detail avatar components.
- Kept page components responsible for composition only; avatar image, fallback, accessibility, and sizing now live in the avatar UI component.

## Files or Areas Affected

- [feature-closeout-F09.md](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/feature-closeout-F09.md)
- [people-directory/src/app/features/persons/ui/person-avatar/person-avatar.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/ui/person-avatar/person-avatar.ts)
- [people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts)
- [people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts)

## What To Verify

- `/persons` renders avatar images for records with working avatar URLs.
- `/persons` renders initials for records with broken avatar URLs.
- `/persons/:id` renders the avatar image for a record with a working avatar URL.
- `/persons/:id` renders large initials for a record with a broken avatar URL.
- Editing a person from a broken avatar URL to a valid avatar URL causes the image to be retried.
- The fallback output has meaningful accessible text.
- The visual size remains compact in the list and larger in the detail identity block.

## Pull Request Status

No dedicated F09 pull request was found during closeout.

The local workspace is currently on branch:
`codex/f08-delete-confirmation-feedback`

F09 work is present locally but has not been confirmed as committed, pushed, or represented by a dedicated F09 pull request from this closeout step.

Recent repository pull requests were checked with the GitHub CLI, and no pull request with `F09` in the title was found.

## GitHub Sync

- Matching issue confirmed: [Issue #2](https://github.com/pato909/mock-api-angular-21/issues/2)
- Completion summary posted to the issue.
- Posted comment id: `4405739262`
- Posted comment URL: [F09 closeout comment](https://github.com/pato909/mock-api-angular-21/issues/2#issuecomment-4405739262)

## Follow-ups or Deferred Work

- The Angular initial bundle budget warning remains and should be handled separately from F09.
- Broader loading, empty, error, and not-found polish remains part of `F10`.
- The current local branch should be reviewed before publishing F09, because it still appears to be the F08 branch.
