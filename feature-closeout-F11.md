# Feature Closeout - F11

## Feature

`F11 - Accessibility and Interaction Pass`

GitHub issue:
[Issue #4](https://github.com/pato909/mock-api-angular-21/issues/4)

## Status

Validated locally.

The application now has a stronger accessibility and keyboard interaction baseline across the shell, persons list, detail, form, and delete confirmation flows. Navigation controls use more appropriate semantics, focus states are easier to see, form validation is announced more clearly, and table actions are more understandable to assistive technologies.

Validation commands:

```text
npm test -- --watch=false
npm run build
git diff --check
```

Result:
- tests passed: `1` test file, `2` tests
- build succeeded
- whitespace check passed
- Angular budget warning remains: initial bundle exceeds the configured `500 kB` budget

## What Was Done

- Replaced shell navigation buttons with real `routerLink` anchors for directory and create navigation.
- Added a skip link to jump directly to the main routed content.
- Strengthened visible focus treatment for native links, buttons, Material buttons, paginator controls, and focused table rows.
- Added accessible search hinting and table labelling on the persons list.
- Added contextual accessible names for list and detail actions such as view, edit, and delete.
- Changed the detail edit action to a real link because it performs navigation.
- Improved person form submission behavior so invalid submits expose validation messaging instead of leaving the submit button unreachable.
- Added a validation summary with `role="alert"` and focus movement to the first invalid form control.
- Added autocomplete hints for common person form fields.
- Improved delete dialog focus behavior by focusing the safer cancel action first and associating the destructive action with the dialog description.
- Updated the shell test setup to provide router services required by `routerLink`.

## Key Decisions

- Preferred native navigation semantics for route changes instead of programmatic button clicks when the action is a link.
- Kept form validation inside the existing reactive form component rather than introducing a separate validation abstraction.
- Used local signal state for the validation summary because it is purely component-local interaction state.
- Kept accessibility enhancements scoped to the V1 surfaces already delivered by previous features.
- Left the existing Material component choices intact and improved semantics around them rather than replacing the UI foundation.

## Files or Areas Affected

- [people-directory/src/app/app.html](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.html)
- [people-directory/src/app/app.scss](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.scss)
- [people-directory/src/app/app.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.ts)
- [people-directory/src/app/app.spec.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/app.spec.ts)
- [people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts)
- [people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts)
- [people-directory/src/app/features/persons/ui/person-form/person-form.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/ui/person-form/person-form.ts)
- [people-directory/src/app/features/persons/ui/delete-person-dialog/delete-person-dialog.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/ui/delete-person-dialog/delete-person-dialog.ts)
- [people-directory/src/styles.scss](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/styles.scss)

## What To Verify

- Keyboard users can tab through the shell, list, table actions, detail actions, form controls, and delete dialog in a predictable order.
- The skip link appears on focus and moves focus to the main content area.
- Focus states remain visibly clear on actions and paginator controls.
- Submitting an invalid create or edit form reveals validation errors and moves focus to the first invalid field.
- Persons list and detail actions expose contextual names to assistive technologies.
- The delete confirmation dialog initially focuses `Annuler` and keeps the destructive action clear.

## Pull Request Status

Pull request created:
Pending publication.

Branch:
Pending publication.

## GitHub Sync

- Matching issue confirmed: [Issue #4](https://github.com/pato909/mock-api-angular-21/issues/4)
- Completion summary pending GitHub sync.
- Pull request pending publication.

## Follow-ups or Deferred Work

- The Angular initial bundle budget warning remains and should be handled separately from F11.
- Browser-based accessibility verification could not be completed in this sandbox because the in-app browser failed to start against the local Windows profile. Build, unit tests, and static diff checks passed.
