## Description
Implement the edit flow by reusing the person form behavior for an existing record and supporting not-found handling and post-update navigation.

## Acceptance Criteria
- The edit page is available at `/persons/:id/edit`.
- The form is prefilled from the current person data.
- The same validation and submit rules as create are applied.
- Submit actions are disabled while the update request is in progress.
- On success, the app shows a snackbar and returns to `/persons/:id`.
- If the record does not exist, the page shows a proper `Person not found` state.

## Estimate
M

## Order
F07
