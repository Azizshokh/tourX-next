# Completed Tasks

## Session Summary

Completed the first core TourX backend domain migration from real-estate `Property` surfaces to travel `TourPackage` / package surfaces.

## Completed Refactors

| Area | Completed Change |
| --- | --- |
| Catalog module | Replaced the old property component with `tour-package` resolver, service, and module. |
| GraphQL API | Renamed property operations to package operations such as `createTourPackage`, `getTourPackages`, `getAgentTourPackages`, and `likeTargetTourPackage`. |
| DTOs | Replaced property DTOs and inputs with `TourPackage`, `TourPackages`, `TourPackageInput`, `TourPackageUpdate`, and package inquiry types. |
| Enums | Replaced property enums with `PackageType` and `PackageStatus`. |
| Schema | Replaced `Property.model.ts` with `TourPackage.model.ts` and collection `tourPackages`. |
| Fields | Removed real-estate fields and added package country/city, duration, people limits, inclusion booleans, currency, and travel dates. |
| Member counters | Replaced `memberProperties` with `memberTours`. |
| Social modules | Replaced `PROPERTY` social groups with `PACKAGE`; favorites and visited lookups now aggregate from `tourPackages`. |
| Notifications | Replaced `propertyId` notification reference with `packageId` referencing `TourPackage`. |
| Batch | Replaced top-properties ranking with top-packages ranking and used `memberTours` in agent rank. |
| Tests | Added focused unit tests for package create/detail/like behavior and batch package/agent ranking. |

## Validation Status

| Check | Status |
| --- | --- |
| API typecheck | Passed: `npx tsc -p apps/tourx-api/tsconfig.app.json --noEmit` |
| Batch typecheck | Passed: `npx tsc -p apps/tourx-batch/tsconfig.app.json --noEmit` |
| Focused tests | Passed: `npm test -- --runInBand` |
| API smoke e2e | Passed: `npm run test:e2e` |
| Batch smoke e2e | Passed: `npx jest --config ./apps/tourx-batch/test/jest-e2e.json` |
| Build | Passed: `npm run build` |
| Active source drift search | Passed for old Property/property/properties/memberProperties terms. |

## Explicitly Deferred

- Booking module
- Payment module
- Review module
- Wishlist module
- Package image module
- Package itinerary module
- Data migration script for moving old `properties` documents into `tourPackages`

## Frontend TourPackage Migration

Completed the TourX frontend migration from real-estate `Property` API usage to the current backend `TourPackage` GraphQL API.

## Frontend Changes

| Area | Completed Change |
| --- | --- |
| Domain types | Added frontend `PackageType`, `PackageStatus`, `TourPackage`, package input/update, and package inquiry types. |
| Apollo documents | Replaced property GraphQL operations with package operations including `getTourPackages`, `getTourPackage`, `createTourPackage`, `updateTourPackage`, `likeTargetTourPackage`, admin package operations, and `getVisitedTours`. |
| Member counters | Updated member/auth/store selections and types from `memberProperties` to `memberTours`. |
| Social groups | Updated like/comment/notification surfaces from `PROPERTY` to `PACKAGE`. |
| Public routes | Added `/tour-package` and `/tour-package/detail`; old `/property` routes now redirect to the package routes. |
| Package UI | Migrated list, detail, cards, filters, homepage package sections, favorites, visited, member pages, and agent package dashboard to package fields and filters. |
| Create/edit flow | Reworked the add/edit package form for package type, destination, pricing/currency, duration, people limits, inclusions, dates, and images. |
| Admin management | Rewired admin package list/update/remove flow to TourPackage operations and package status filters. |
| Cleanup | Removed obsolete frontend property enum/type files and replaced visible core navigation/package copy incrementally. |

## Frontend Validation Status

| Check | Status |
| --- | --- |
| Typecheck | Passed: `yarn tsc --noEmit` |
| Production build | Passed: `yarn build` |
| Active source drift search | Passed for old property GraphQL operation names, `PropertyInput`, `PropertyUpdate`, `memberProperties`, and old real-estate package fields. |

## Frontend Notes

- The admin route remains `/_admin/properties` for compatibility, but the screen is now package-backed and labeled for packages.
- Some component filenames/classes still contain legacy `Property` naming to keep the migration incremental; behavior and public GraphQL surfaces are package-backed.
- Manual browser verification against a live backend is still recommended for package list/detail, like/comment, agent package CRUD, favorites, visited, admin update/remove, and old route redirects.

## Frontend Comment Media Attachment Support

Added frontend comment media support for TourPackage reviews, agent reviews, and community article comments.

| Area | Completed Change |
| --- | --- |
| Comment contract | Added `commentImages` and `commentVideo` to frontend comment input/output types and Apollo selections. |
| Media picker | Added a reusable comment media picker with image/video mutual exclusion, previews, remove controls, and clear validation errors. |
| Upload flow | Reused existing multipart `imagesUploader` flow with `target: "comment"` for image attachments before `createComment`. |
| Video handling | Added video selection/preview validation, but blocked submit with a clear frontend error because the current backend upload resolver does not accept video MIME types. |
| Comment forms | Wired media picker into package detail reviews, agent detail reviews, and community article comments. |
| Comment display | Rendered attached images and video fields in package, agent, and community comment displays. |

Validation: `yarn tsc --noEmit` passed.

## 2026-06-14 - TourX homepage design refresh
- Updated homepage hero copy and visual treatment using TourX background/video assets.
- Rebuilt Trending Packages as a responsive premium asymmetric grid using existing TourPackage data.
- Added Travel Inspiration homepage section with responsive image tiles.
- Verified with yarn tsc --noEmit and yarn build.

## 2026-06-15 - Detail page selectable days & travelers with live price
- Turned the static days/people chips in `.left-box .bottom-box .option` on the tour package detail page into interactive `−`/`+` steppers.
- Days range = `durationDays … durationDays + 7`; travelers range = `minPeople … maxPeople`; stepper buttons disable at bounds.
- Added a frontend-only live price (`useMemo`) using a per-day × per-person model: `dailyRate = packagePrice / durationDays`, `total = dailyRate × selectedDays × selectedTravelers`. This matches the backend `getTourPackageQuote` exactly at the default duration (`packagePrice × travelers`) and extends day pricing on the frontend (backend has no day-based pricing). No GraphQL/Apollo changes.
- Booking-card price and note now reflect the live total and the selected days/travelers.
- Files: `pages/tour-package/detail.tsx`, `scss/pc/property/detail.scss`.
- Verified with `npx tsc --noEmit` (0 errors). Manual browser verification against a live backend still recommended.

## 2026-06-15 - Fix travelers stepper "not working"
- **Bug 1 fixed**: When `minPeople === maxPeople` (valid in the backend, no cross-field validator), both stepper buttons were disabled, making the travelers control appear completely broken. Fixed by rendering a static `.opt-fixed` count label instead of stepper buttons when `minTravelers >= maxTravelers`. Same guard applied to days for safety.
- **Bug 2 fixed**: `onCompleted` on `GET_TOUR_PACKAGE` fired on every `getTourPackageRefetch` (e.g., after liking), resetting `selectedDays`/`selectedTravelers` back to defaults. Fixed with a `hasInitializedSelectors` ref — initialization now runs exactly once per page mount.
- Files: `pages/tour-package/detail.tsx`, `scss/pc/property/detail.scss`.
- Verified with `npx tsc --noEmit` (0 errors).

## 2026-06-20 - Agent detail like and follow actions
- Added agent like, follow, and unfollow actions to the desktop agent detail hero using the existing member social GraphQL mutations.
- Expanded the hero stats to expose backend counters for tour packages, followers, following, views, likes, and member-since year.
- Files: `pages/agent/detail.tsx`, `scss/pc/agent/detail.scss`.
- Verified with `yarn tsc --noEmit` and `node_modules\.bin\sass scss\pc\main.scss`.
- Manual logged-in browser verification is still recommended for live like/follow toggle behavior.

## 2026-06-20 - Write article page TourX design refresh
- Redesigned the desktop write article experience with a TourX community header, premium editor panels, category/title controls, writing tips, and a warm publish CTA.
- Added fitting MUI icons for writing, destination insight, photo support, category, title, editor media, tips, and publish actions.
- Preserved existing Toast UI editor, image upload flow, `CREATE_BOARD_ARTICLE` mutation, route behavior, and article payload shape.
- Files: `libs/components/mypage/WriteArticle.tsx`, `libs/components/community/Teditor.tsx`, `scss/pc/mypage/writeArticle.scss`.
- Verified with `yarn tsc --noEmit` and `node_modules\.bin\sass scss\pc\main.scss`.

## 2026-06-20 - My page sidebar TourX navigation refresh
- Rebuilt the desktop my page left navigation with TourX travel/account/community group labels and MUI icons.
- Added warm orange, green, blue, purple, and red icon accents while preserving existing `category` query routing and logout behavior.
- Updated the sidebar profile card, role badge, active menu state, hover states, and menu typography to match the TourX premium design mode.
- Files: `libs/components/mypage/MyMenu.tsx`, `scss/pc/mypage/mypage.scss`.
- Verified with `yarn tsc --noEmit` and `node_modules\.bin\sass scss\pc\main.scss`.

## 2026-06-20 - My page saved trips and follow list logic
- Fixed recently viewed packages to call the backend `getVisitedTours` field and read the matching response key.
- Updated saved trips copy, empty states, safe pagination counts, and page fallback after removing the last saved trip on a page.
- Cleaned followers/following list wiring with valid member-id guards, safe `metaCounter` handling, self-follow prevention, and normalized `Followers` / `Following` labels.
- Files: `apollo/user/query.ts`, `libs/components/mypage/MyFavorites.tsx`, `libs/components/mypage/RecentlyVisited.tsx`, `libs/components/member/MemberFollowers.tsx`, `libs/components/member/MemberFollowings.tsx`, `libs/components/member/MemberMenu.tsx`, `pages/mypage/index.tsx`, `pages/member/index.tsx`.
- Verified with `yarn tsc --noEmit` and `node_modules\.bin\sass scss\pc\main.scss`.

## 2026-06-21 - Frontend TourPackage naming cleanup
- Renamed remaining package-backed frontend component files, folders, symbols, imports, and SCSS imports from legacy `Property` / `Properties` naming to `TourPackage` / `TourPackages`.
- Kept compatibility URLs and query categories where needed: `/property`, `/property/detail`, admin `/_admin/properties`, my page `addProperty` / `myProperties`, and member fallback `category=properties`.
- Updated visible package copy in support/about surfaces and renamed safe component-owned CSS selectors for package cards, homepage package sections, and member package lists.
- Files included package cards/list/detail components, homepage package sections, my page package components, member package components, admin package list imports, route imports, locales, and package SCSS folders.
- Verified with `yarn tsc --noEmit`, `node_modules\.bin\sass scss\pc\main.scss`, and `yarn build`.
- `yarn lint` remains interactive because Next prompts to configure ESLint when run directly; build lint/type validation passed.
