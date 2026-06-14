# Frontend Migration Plan: Nestar -> TourX

## Migration Principle

The backend safe rename preserves existing GraphQL APIs and MongoDB collections. The Next.js frontend should therefore update branding and visible project labels first, while keeping GraphQL operation names and domain data contracts unchanged.

## Step-by-Step Plan

| Step | Action | Notes |
| --- | --- | --- |
| 1 | Create a frontend migration branch | Keep UI rename separate from backend domain changes. |
| 2 | Search for Nestar branding | Use `rg -n "Nestar|nestar"` in the frontend repo. |
| 3 | Replace visible app branding | Update logos, page titles, metadata, nav labels, footer copy, toast messages, and SEO text to TourX. |
| 4 | Update environment labels | Rename public labels such as `NEXT_PUBLIC_APP_NAME=Nestar` to `TourX` if present. Do not change API URLs unless backend hostnames changed. |
| 5 | Preserve GraphQL operations | Keep existing `Property` and `Agent` GraphQL queries/mutations unchanged. |
| 6 | Update generated client config only if paths changed | If GraphQL endpoint URL includes `nestar`, change only the host/path label required by deployment. |
| 7 | Run typecheck and UI smoke tests | Confirm frontend still compiles with unchanged backend schema. |
| 8 | Document remaining domain terminology | Any `Property`/`Agent` UI text should be reviewed separately as product terminology, not as API migration. |

## Page and Component Mapping

Because the backend domain remains unchanged, page/component migrations should be a branding rename rather than a route/API rewrite.

| Old Nestar Frontend Area | TourX Frontend Target | Backend Contract |
| --- | --- | --- |
| Home / landing page | TourX branded home page | No GraphQL contract change |
| Header / navbar | TourX logo and app name | No GraphQL contract change |
| Footer | TourX company/platform copy | No GraphQL contract change |
| Auth pages | TourX login/signup branding | `signup`, `login` unchanged |
| Profile page | TourX profile shell | `getMember`, `updateMember` unchanged |
| Property listing page | Keep route/component behavior unless product chooses UI wording change | `getProperties` unchanged |
| Property detail page | Keep data contract | `getProperty` unchanged |
| Property create/edit forms | Keep field names and GraphQL input mapping | `createProperty`, `updateProperty` unchanged |
| Agent listing page | Keep data contract | `getAgents` unchanged |
| Agent properties page | Keep data contract | `getAgentProperties` unchanged |
| Favorites page | Keep property favorite behavior | `getFavorites` unchanged |
| Visited page | Keep property visited behavior | `getVisited` unchanged |
| Admin property management | Keep admin operations | `getAllPropertiesByAdmin`, `updatePropertyByAdmin`, `removePropertyByAdmin` unchanged |

## GraphQL Query and Mutation Rename Plan

For this safe rename layer, do not rename GraphQL operations.

| Operation Type | Current Operation | Frontend Action |
| --- | --- | --- |
| Auth mutation | `signup`, `login` | Keep unchanged |
| Member query/mutation | `getMember`, `updateMember`, `likeTargetMember` | Keep unchanged |
| Agent query | `getAgents` | Keep unchanged |
| Property query | `getProperty`, `getProperties`, `getAgentProperties` | Keep unchanged |
| Property mutation | `createProperty`, `updateProperty`, `likeTargetProperty` | Keep unchanged |
| Admin property operations | `getAllPropertiesByAdmin`, `updatePropertyByAdmin`, `removePropertyByAdmin` | Keep unchanged |
| Social modules | Comment, Like, View, Follow operations | Keep unchanged |

If a future full domain migration is approved, add new TourX-friendly GraphQL aliases first, then migrate frontend calls gradually.

## UI Terminology Changes

| UI Text Type | Change Now | Defer |
| --- | --- | --- |
| App name | `Nestar` -> `TourX` | None |
| Browser title / metadata | `Nestar` -> `TourX` | None |
| Logo alt text | `Nestar` -> `TourX` | None |
| API operation labels | No change | Potential future Tour/Guide aliases |
| Property terminology | No API-driven change | Product decision: keep Property or rename visible copy |
| Agent terminology | No API-driven change | Product decision: keep Agent or rename visible copy |
| Database/admin technical labels | No change | Future full domain migration |

## Validation Checklist

- `rg -n "Nestar|nestar"` returns no unintended visible frontend branding.
- GraphQL codegen still succeeds against the current backend schema.
- Property and Agent pages still load.
- Create/update property forms still submit the original input fields.
- Auth, favorites, visited properties, comments, likes, and admin flows still work.
