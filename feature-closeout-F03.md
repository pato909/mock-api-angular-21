# Feature Closeout - F03

## Feature

F03 - Persons Domain Model and Data Access Layer

## Status

Validated with one deferred item.

The persons domain model and the core data access layer are now in place and usable as the foundation for the next features. The refresh strategy after mutations is intentionally deferred and is not part of the delivered code yet.

## What Was Done

- Added a typed `Person` domain model aligned with the current MockAPI payload.
- Added a typed `PersonUpsertPayload` model for create and update requests.
- Added a typed `PersonsListQuery` model for server-side list reads.
- Implemented a dedicated mutations service using `HttpClient` for `create`, `update`, and `delete`.
- Implemented declarative read resources using `httpResource()` for:
  - the persons list endpoint with `search`, `sortBy`, `order`, `page`, and `limit`
  - the person detail endpoint for `/persons/:id`
- Kept read flows and mutation flows separated to match the planned Angular architecture.

## Key Decisions

- Kept API-facing date and metadata fields as strings in the domain model to stay aligned with the backend contract.
- Used `httpResource()` only for reads and `HttpClient` only for mutations.
- Did not introduce a facade or refresh orchestration yet.
- Chose to defer refresh behavior after mutations to a later feature pass so F03 can remain focused on the base data layer.

## Files or Areas Affected

- [person.model.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/model/person.model.ts)
- [person-query.model.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/model/person-query.model.ts)
- [persons-api.service.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/data/persons-api.service.ts)
- [persons-resources.ts](C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/data/persons-resources.ts)

## What To Verify

- `Person` matches the real MockAPI payload shape.
- The list read supports `search`, `sortBy`, `order`, `page`, and `limit`.
- The detail read targets `/persons/:id`.
- `create`, `update`, and `delete` use `HttpClient` and return typed responses.
- The next feature work can consume these types and services without restructuring the data layer.

## Follow-ups or Deferred Work

- A clear refresh strategy after mutations is still missing from the delivered code.
- The roadmap acceptance criterion about refreshing reads after mutations is therefore not fully implemented yet.
- This deferred work should be handled when wiring the list/detail flows in the next feature steps.
- No pull request was created from this closeout because the work is currently local, uncommitted, and on `main`.
