## Description
Implement the `persons` domain model, typed API integration, list query state, and read/write data flows using `httpResource()` for reads and `HttpClient` for mutations.

## Acceptance Criteria
- The `Person` model reflects the real MockAPI payload.
- List reads use `httpResource()` with support for `search`, `sortBy`, `order`, `page`, and `limit`.
- Detail reads use `httpResource()` for `/persons/:id`.
- `create`, `update`, and `delete` use `HttpClient`.
- The data layer exposes a clear way to refresh reads after mutations.

## Estimate
L

## Order
F03
