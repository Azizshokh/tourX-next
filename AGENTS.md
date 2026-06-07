Go outside of this project and read tourX/docs/ai first!

# TourX Frontend Modification Instructions

This client project is being migrated from nestar-next to tourX-next

## Rules

- Preserve current project architecture
- Keep GraphQL/Apollo integration
- Do not rewrite the whole app
- Improve UI incrementally

## Backend Context

Before making changes, read:

- docs/ai/BACKEND_MIGRATION.md
- docs/ai/DECISIONS.md
- docs/ai/FRONTEND_MIGRATION.md
- and etc inside of tourX/docs/ai

## Workflow

1. Analyze before editing.
2. Backend is running on port http://localhost:3007/graphql now.
3. Make small incremental changes.
4. Run typecheck after each phase.
5. Do not remove working logic unless replaced safely.
6. Update tourX/docs/ai/COMPLETED_TASKS.md after major changes.

## Pachage Management

- Use Yarn for all frontend commands.
- Do not use npm or pnpm.
- Install dependencies with :

'''bash
yarn install
'''
