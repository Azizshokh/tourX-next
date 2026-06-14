# Next Steps

## Backend Cleanup

| Priority | Task | Notes |
| --- | --- | --- |
| 1 | Commit or review the safe rename diff | Confirm only app/project branding changed and domain behavior stayed intact. |
| 2 | Run a final domain-drift sweep before merge | Search for unintended `TourService`, `Guide`, `GUIDE`, `tours`, and `memberTours`. |
| 3 | Decide how to handle `.env` database label names | Do not rename MongoDB database targets without confirming runtime data impact. |
| 4 | Separate lint cleanup into its own task | Current lint issues are broad formatting/type-aware debt, not rename-specific. |
| 5 | Add a backend compatibility checklist to PR notes | Explicitly state that GraphQL APIs and MongoDB collections are unchanged. |

## Frontend Migration

| Priority | Task | Notes |
| --- | --- | --- |
| 1 | Search frontend for `Nestar` / `nestar` | Replace visible branding with TourX. |
| 2 | Update app metadata and SEO | Browser title, OpenGraph, favicon alt text, manifest, and footer copy. |
| 3 | Update layout/nav branding | Logo text, header, sidebar, footer, loading screens, empty states. |
| 4 | Preserve GraphQL operation names | Keep `getProperties`, `createProperty`, `getAgents`, and related operations unchanged. |
| 5 | Smoke test property and agent flows | Existing data contracts should continue to work. |

## Testing

| Priority | Task | Notes |
| --- | --- | --- |
| 1 | Add focused backend unit tests around existing Property behavior | Do this without renaming domain APIs. |
| 2 | Expand e2e smoke coverage | Cover auth, property list/detail, agent list, favorite/visited properties. |
| 3 | Add frontend GraphQL compatibility tests | Confirm existing generated operations compile against backend schema. |
| 4 | Decide lint cleanup strategy | Either format/fix in a dedicated PR or relax rules to match current code style. |

## Documentation

| Priority | Task | Notes |
| --- | --- | --- |
| 1 | Keep `docs/` in sync with current safe rename state | These docs should remain the source of truth for migration scope. |
| 2 | Add PR checklist | Include branding, API compatibility, DB compatibility, and validation commands. |
| 3 | Document environment variables | Separate display labels from runtime database targets. |
| 4 | Create future full-domain migration proposal only if requested | Tour/Guide migration requires a separate compatibility and data plan. |
