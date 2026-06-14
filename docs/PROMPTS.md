# Useful Prompts

## Prompts From This Session

```text
Analyze current Nestar monorepo structure to transform existing NestJS Monorepo Nestar platform into TourX platform
```

```text
Safe rename Layer (No Business logic change)

Rename all visible project/app identifiers from Nestar to TourX. Do Not change domain logic.

Keep APIs and database collections unchanged. Update package names, environment labels constants. Run lint and typecheck after refactoring. Please make plan first!
```

```text
PLEASE IMPLEMENT THIS PLAN:
# Safe Rename: Nestar To TourX, No Domain Changes
...
```

```text
Create a new folder: docs
Inside it, generate these markdown files:

BACKEND_MIGRATION.md
DECISIONS.md
FRONTEND_MIGRATION.md
COMPLETED_TASKS.md
NEXT_STEPS.md
PROMPTS.md

Use everything completed and discussed in this Codex session.
```

## Reusable Prompts For Next Codex Session

### Verify Safe Rename

```text
Verify the current Nestar -> TourX safe rename layer.

Do not change source code. Confirm that app/package/project branding is TourX, while backend domain logic remains Property/Agent. Run searches for unintended Tour/Guide domain drift and summarize results with file references.
```

### Frontend Migration

```text
Plan the Next.js frontend safe rename from Nestar to TourX.

Preserve all GraphQL operation names and backend data contracts. Only rename visible app branding, metadata, navigation labels, and environment display labels. Produce a step-by-step implementation plan and validation checklist.
```

### Lint Cleanup Without Behavior Changes

```text
Create a plan to clean existing ESLint/Prettier issues without changing backend behavior.

Separate formatting-only fixes from type-safety fixes. Do not rename domain concepts. Include verification commands and a rollback-safe batching strategy.
```

### GraphQL Compatibility Checklist

```text
Create a GraphQL compatibility checklist for the TourX safe rename.

Confirm that Property/Agent operations, DTOs, enums, and MongoDB collections are unchanged. Include frontend codegen and smoke-test steps.
```

### Deployment Checklist

```text
Create a deployment checklist for the TourX backend safe rename.

Include package scripts, Nest project names, process manager config, environment variables, MongoDB URI verification, smoke tests, and rollback notes. Do not include data migrations.
```

### Future Full Domain Migration

```text
Draft a separate future migration proposal from Property/Agent to Tour/Guide.

Treat it as a breaking/domain migration, not part of the safe rename. Include GraphQL aliases, MongoDB data migration strategy, compatibility risks, and phased rollout.
```
