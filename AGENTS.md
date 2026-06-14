# TourX Frontend Agent Instructions

TourX is a travel marketplace frontend project migrated from `nestar-next` to `tourX-next`.

This project must be improved incrementally. Do not rewrite the whole application.

## Read First

Before making any code changes, go outside of the current project if needed and read the AI documentation inside:

```bash
tourX/docs/ai
```

Important files:

- `docs/ai/BACKEND_MIGRATION.md`
- `docs/ai/DECISIONS.md`
- `docs/ai/FRONTEND_MIGRATION.md`
- `docs/ai/COMPLETED_TASKS.md`
- Any other relevant file inside `docs/ai`

Use these documents as the source of truth for migration history, backend context, accepted decisions, completed work, and remaining tasks.

## Core Rules

- Preserve the current project architecture.
- Keep the existing Next.js page structure.
- Keep GraphQL and Apollo integration.
- Do not rewrite the whole app.
- Improve UI and UX incrementally.
- Keep existing routes, queries, mutations, and business logic working.
- Prefer small, safe changes over large refactors.
- Analyze before editing.
- After major changes, update `tourX/docs/ai/COMPLETED_TASKS.md`.

## Backend Context

The backend GraphQL API is currently running at:

```bash
http://localhost:3007/graphql
```

Do not change backend assumptions without checking the AI docs first.

## Package Management

Use Yarn only.

Allowed:

```bash
yarn install
yarn dev
yarn build
yarn typecheck
```

Not allowed:

```bash
npm install
pnpm install
```

Do not create or update `package-lock.json` or `pnpm-lock.yaml`.

## Development Workflow

1. Read `tourX/docs/ai` first.
2. Inspect the existing frontend structure.
3. Identify the smallest safe change.
4. Preserve GraphQL/Apollo logic.
5. Modify UI incrementally.
6. Run typecheck after each phase.
7. Fix TypeScript and lint issues safely.
8. Update documentation after major completed work.

## UI Modification Rules

TourX should look like a modern premium travel marketplace.

Design inspiration:

- Airbnb Experiences
- Booking.com Attractions
- GetYourGuide
- Klook
- Apple-style product quality

Brand style:

- Clean white surfaces
- Deep navy / charcoal text
- Warm orange CTA buttons
- Soft blue and green destination accents
- Premium travel photography
- Rounded cards
- Smooth hover animations
- Responsive layouts

Do not create random page-specific designs. Keep the visual system consistent across pages.

## Navbar Rule

The navbar must be treated as a shared global layout component.

- Do not create different navbar versions for different pages.
- Keep navbar structure, spacing, colors, and interactions consistent.
- If the navbar is updated, it should apply globally.
- Desktop, tablet, and mobile behavior must remain responsive.

## Trending Packages Rule

Trending package sections should use a premium asymmetric layout when requested:

- One large featured card on the left.
- Two smaller cards stacked vertically on the right.
- Use destination images with gradient overlays.
- Add hover animation:

  - Image zoom
  - Card lift
  - Soft shadow
  - Bottom details slide-up
  - CTA button highlight

Do not make all cards equal width and height on desktop unless explicitly requested.

## GraphQL / Apollo Rules

- Do not remove existing queries or mutations.
- Do not change variable shapes unless backend DTOs confirm it.
- Preserve loading, error, refetch, and cache behavior.
- Keep authentication and user state logic unchanged.
- Avoid mock data when real backend data already exists.
- If temporary fallback data is needed, clearly isolate it.

## Migration Rules

This project is migrated from real-estate style logic to TourX travel marketplace logic.

Use TourX terminology where UI-facing text is changed:

- Property → Tour Package
- Properties → Tour Packages
- Agent → Tour Company / Travel Agent, depending on existing business logic
- Location → Destination
- Favorite → Saved Trip / Wishlist when appropriate
- Review remains Review
- Community remains Community

Do not rename backend fields blindly. UI labels can be improved, but GraphQL field names must stay compatible with backend schemas.

## Safety Rules

Do not:

- Rewrite the full app.
- Remove working business logic.
- Break existing routes.
- Replace Apollo with another data layer.
- Change package manager.
- Commit API keys.
- Add secrets to frontend code.
- Delete documentation.
- Ignore TypeScript errors.
- Make large refactors without explanation.

## Validation

After changes, run:

```bash
yarn typecheck
```

If available, also run:

```bash
yarn build
```

Fix errors carefully and explain what changed.

## Documentation Update

After major frontend changes, update:

```bash
tourX/docs/ai/COMPLETED_TASKS.md
```

Include:

- What was changed
- Which files were modified
- Whether typecheck/build passed
- Any remaining issues
- Next recommended step

## Agent Behavior

When working on this project:

- First explain the plan.
- Then make small changes.
- Keep code style consistent with the project.
- Prefer existing components and patterns.
- Ask only when the requirement is truly ambiguous.
- Preserve TourX business logic.
- Improve the UI step by step.
