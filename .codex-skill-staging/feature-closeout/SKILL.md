---
name: feature-closeout
description: Summarize a completed or validated feature into a clear project file, sync the same summary back to the matching GitHub issue, and ensure there is a pull request for the feature when one does not already exist. Use when Codex needs to document what was done for a feature, capture completion notes, explain the delivered outcome clearly, update the related GitHub issue, and prepare feature completion for review.
---

# Feature Closeout

Document a validated feature clearly and sync that summary to GitHub.

## Core goal

- Take a completed or validated feature.
- Create a clear summary file in the repository.
- Update the matching GitHub issue with the same closeout information.
- Ensure the feature work is represented by a pull request if one does not already exist.
- Make the summary understandable for future readers, not just the current implementer.

## When to use

Use this skill when:
- a feature is considered done or validated
- the user wants a written record of what was completed
- the project needs a per-feature delivery summary
- the related GitHub issue should be updated with completion details

## Input sources

When available, use the strongest available context:

1. user request
2. GitHub issue or feature id
3. `features-roadmap.md`
4. `grill-me.md`
5. `angular-architecture.md`
6. current code changes and repository state
7. prior discussion in the thread

Base the summary on actual completed work, not just planned work.

## What to produce

For each validated feature:
- create a Markdown file in the repository
- summarize clearly what was done
- explain the main decisions and delivered outcome
- mention important files or areas touched when useful
- mention limitations, follow-ups, or deferred items if relevant
- sync that summary into the matching GitHub issue
- verify whether a pull request already exists for the feature work
- if no pull request exists, create one or prepare one according to the repository workflow

## Output file convention

Default filename pattern:
- `feature-closeout-FXX.md`

Examples:
- `feature-closeout-F01.md`
- `feature-closeout-F04.md`

If the user prefers another naming scheme, follow it.

## Recommended summary structure

Use a structure like:

```md
# Feature Closeout - F01

## Feature

## Status

## What Was Done

## Key Decisions

## Files or Areas Affected

## What To Verify

## Follow-ups or Deferred Work
```

## Writing guidance

- Write in clear project language.
- Favor concrete statements over vague completion notes.
- Make it understandable to someone opening the project later.
- Distinguish completed work from future work.
- If something was intentionally left out, say so explicitly.

## GitHub sync behavior

- Find the matching GitHub issue for the feature.
- Update the issue with the feature summary.
- Prefer posting or updating a clear completion comment unless the user explicitly asks for another format.
- If issue labels, checklists, or workflow conventions already exist, respect them.
- Do not create duplicate issues.

## Pull request behavior

- Check whether the feature already has an open or merged pull request.
- If a relevant pull request already exists, reference it in the summary when useful.
- If no pull request exists and the feature work is ready for review, create a pull request.
- If the repository workflow requires a branch first, ensure the branch state is suitable before creating the pull request.
- If the work is not yet committed or pushed, explain the blocker clearly instead of pretending a PR can be created.
- Prefer a pull request title and body that align with the feature id and roadmap wording.

## GitHub ambiguity handling

- If the matching issue cannot be identified confidently, stop and explain the ambiguity.
- If GitHub access is not available, still create the local summary file and report the blocker.
- If a pull request cannot be created because the branch is missing, unpushed, or not ready, state that clearly in the output.

## Project-aware behavior

- Align the summary with the feature wording already used in `features-roadmap.md` and GitHub.
- If architecture or planning documents informed the implementation, mention that when useful.
- If the delivered result differs from the planned feature scope, explain the difference clearly.

## Out of scope

- Do not invent completion details that are not supported by the code or project context.
- Do not silently mark incomplete work as done.
- Do not switch into implementation mode unless the user explicitly asks for more code changes.
