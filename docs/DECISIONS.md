# Architectural Decisions

## Decision Log

| Decision | Why It Was Made | Risks | Alternatives Considered |
| --- | --- | --- | --- |
| Use a safe rename layer only | The user explicitly requested no business logic changes. This protects existing API clients and MongoDB data. | TourX branding may not match the real-estate Property/Agent terminology yet. | Full domain migration to Tour/Guide; hybrid aliases. |
| Preserve `Property` and `Agent` domain names | These names are part of GraphQL APIs, DTOs, schemas, batch logic, and MongoDB documents. | Product language remains real-estate oriented until a future domain migration. | Rename to Tour/Guide, or add aliases while retaining old API names. |
| Preserve MongoDB collections | Existing data lives in collections such as `properties`; renaming them would be a data migration, not a safe rename. | Database names may look legacy. | Rename `properties` to `tours`; create compatibility views; dual-write. |
| Preserve GraphQL operation names | Current clients likely depend on operations like `getProperties`, `createProperty`, and `getAgents`. | Frontend UI may still expose old terminology until separately updated. | Rename operations and break compatibility; add duplicate operations. |
| Remove unsafe migration artifacts | A prior deeper migration script renamed collections and fields, which violates the safe rename goal. | If future Tour/Guide migration resumes, a new migration script must be designed. | Keep the script but mark it unused; move it to archived docs. |
| Keep batch formulas unchanged | Ranking formulas are business behavior. The safe rename must not alter ranking semantics. | Existing ranking assumptions remain tied to Property/Agent concepts. | Reweight formulas for travel packages in a later domain migration. |
| Do not run MongoDB migrations | The safe rename changes project labels only. Running migrations would mutate external state. | Database labels may still contain legacy or current environment names. | Add a verified migration step in a future full domain migration. |
| Avoid broad lint auto-fix | ESLint reported thousands of pre-existing formatting/type-aware issues. Auto-fixing would create noisy unrelated churn. | Lint remains failing until a separate cleanup pass. | Run `npm run lint --fix` and accept large formatting changes; narrow lint config. |
| Install missing `typescript-eslint` dev dependency | The existing ESLint flat config imported `typescript-eslint`, but the package was missing. | Adds dev dependency and lockfile change. | Rewrite ESLint config to use existing packages; skip lint entirely. |

## Current Architecture Decision

TourX is currently the platform/app name. `Property` and `Agent` are still the backend domain model.

This is intentional. The session first explored and briefly implemented a deeper travel-domain migration, but the user later clarified the desired layer as a safe rename with no business logic change. The deeper migration was therefore corrected out of the current architecture.

## Risks to Track

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Brand/domain mismatch | Users may see TourX branding alongside Property/Agent terms. | Treat UI terminology cleanup as a frontend-safe rename task; do not change API yet. |
| Accidental domain drift | Future edits may reintroduce Tour/Guide symbols in backend code. | Run domain-drift searches before merging. |
| Lint debt | CI may fail if lint is required. | Schedule a dedicated lint cleanup separate from migration work. |
| Environment confusion | `.env` Mongo URI names may not match branding. | Verify database targets manually before renaming any database. |
| Frontend assumptions | Frontend may assume backend APIs were renamed. | Document that GraphQL operations are unchanged for this layer. |

## Future Decision Points

| Topic | Decision Needed Later |
| --- | --- |
| Full travel-domain migration | Whether to rename Property/Agent to Tour/Guide and how to preserve compatibility |
| GraphQL aliases | Whether to add TourX-friendly API aliases without removing old APIs |
| MongoDB migration | Whether to rename collections/fields or retain legacy storage |
| UI terminology | Whether user-facing copy should say property/agent or tour/host/guide |
| Lint enforcement | Whether to fix existing issues or relax rules for current code style |
