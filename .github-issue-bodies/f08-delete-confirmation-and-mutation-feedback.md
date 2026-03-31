## Description
Add the agreed delete experience, including confirmation dialog, mutation feedback, and refresh/navigation behavior from both list and detail entry points.

## Acceptance Criteria
- A delete action is available from both the list and detail views.
- Deleting a person always requires a `MatDialog` confirmation.
- A successful delete shows a success snackbar.
- A failed delete shows an error snackbar.
- Deleting from the detail page redirects back to `/persons`.
- The list reflects deletions without requiring a full manual reload.

## Estimate
M

## Order
F08
