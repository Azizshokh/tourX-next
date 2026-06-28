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

## 2026-06-21 - TourX help page redesign
- Rebuilt the desktop `/cs` page as a TourX help center with Popular Topics cards and a category-based FAQ layout.
- Added MUI travel/support icons, warm orange active states, soft cream icon badges, peach borders, and compact help-center typography.
- Replaced legacy real-estate FAQ copy with TourX booking, payments, package, agency, account, policy, community, and general support questions.
- Files: `pages/cs/index.tsx`, `libs/components/cs/Faq.tsx`, `scss/pc/cs/cs.scss`.
- Verified with `yarn.cmd tsc --noEmit` and `node_modules\.bin\sass scss\pc\main.scss`.

## 2026-06-21 - Admin FAQ creation flow
- Wired the admin FAQ page to the existing backend FAQ GraphQL API with real category loading, FAQ list pagination, status/category/text filtering, and an Add FAQ modal.
- Added frontend FAQ Apollo documents and minimal FAQ types/enums matching backend `FaqInquiry`, `CreateFaqInput`, `Faq`, and `FaqCategory`.
- Replaced placeholder admin FAQ table rows with real FAQ question, answer, category, order, date, and status data.
- Files: `pages/_admin/cs/faq.tsx`, `libs/components/admin/cs/FaqList.tsx`, `apollo/admin/query.ts`, `apollo/admin/mutation.ts`, `libs/types/faq/*`, `libs/enums/faq.enum.ts`, `scss/pc/admin/admin.scss`.
- Verified with `yarn.cmd tsc --noEmit`, `node_modules\.bin\sass scss\pc\main.scss $env:TEMP\tourx-sass-check.css`, and `yarn.cmd build`.
- `yarn.cmd lint` remains interactive because Next prompts to configure ESLint when run directly; build lint/type validation passed.

## 2026-06-27 - Admin package status management
- Wired the admin package table to the new ADMIN-only `updatePackageStatus(packageId, status)` GraphQL mutation.
- Added status confirmation, optimistic row updates, rollback on mutation failure, per-row disabled state, and local row replacement/removal without refetching the whole package list after status changes.
- Kept public package visibility unchanged through existing public package queries that only return `ACTIVE` packages; admin package queries still show all statuses.
- Displayed `DELETE` wire status as `DELETED` in the admin UI to preserve the current GraphQL enum while matching TourX product language.
- Files: `pages/_admin/properties/index.tsx`, `libs/components/admin/tourPackages/TourPackageList.tsx`, `apollo/admin/mutation.ts`, `apollo/admin/query.ts`, `libs/types/tour-package/tour-package.ts`, `libs/types/tour-package/tour-package.update.ts`.
- Validation: `yarn.cmd tsc --noEmit` passed; `yarn.cmd build` passed with existing Browserslist/i18next warnings.
- Remaining issue: manual browser verification against a running backend is still recommended for live admin status changes.
- Next recommended step: run through admin status transitions in the browser for `ACTIVE`, `CLOSED`, and `DELETED` rows with real package data.

## 2026-06-27 - Multilingual translation stabilization
- Stabilized `next-i18next` for `en`, `kr`, and `ru` with explicit namespaces, English fallback, and shared app-level config passed into `appWithTranslation`.
- Added consistent namespace files for `common`, `auth`, `home`, `package`, `agent`, `community`, `admin`, `footer`, and `errors` across all three locales.
- Fixed the global language selector so Korean uses `kr` instead of the invalid `uz` path, persists the selected locale in localStorage, and syncs stored locale with `router.locale`.
- Replaced hardcoded UI copy with translation keys across the global nav/footer/layouts, homepage hero/search/package/community sections, package list/detail/filter/cards, auth join/login form, agent list, community list/detail, and admin shell/users/package status pages.
- Kept backend-provided content untranslated, including package titles/descriptions, member names, article/comment content, destination data, and GraphQL enum wire values.
- Added `libs/i18n.ts` namespace helpers and page-level translation loading for key localized routes.
- Files: `next-i18next.config.js`, `pages/_app.tsx`, `libs/i18n.ts`, `public/locales/{en,kr,ru}/*.json`, global layout components, homepage/package/community/agent/auth pages, and selected admin users/packages pages.
- Validation: locale key consistency check passed; `rg "uz"` found no invalid locale references; `yarn.cmd tsc --noEmit` passed; `yarn.cmd build` passed without react-i18next initialization warnings.
- Remaining issue: a few deeper legacy/account/admin support surfaces may still contain static copy and should be translated incrementally during the next focused UI pass.
- Next recommended step: manually click EN/KR/RU on `/`, `/tour-package`, `/tour-package/detail`, `/agent`, `/community`, `/community/detail`, `/account/join`, and admin users/packages pages against a running backend.

## 2026-06-27 - Homepage remaining translation fixes
- Translated the remaining homepage sections reported after the first multilingual pass: Travel Inspiration, Top Agents, and See What Travelers Say About TourX.
- Added localized section headings, descriptions, inspiration card labels, top agent labels/buttons, testimonial headings, fallback testimonial text, role labels, and carousel accessibility labels.
- Files: `libs/components/homepage/TravelInspiration.tsx`, `libs/components/homepage/TopAgents.tsx`, `libs/components/homepage/TopAgentCard.tsx`, `libs/components/common/AgentCard.tsx`, `libs/components/homepage/CommunityComments.tsx`, `public/locales/{en,kr,ru}/home.json`, `public/locales/{en,kr,ru}/agent.json`.
- Validation: exact phrase scan found no remaining hardcoded TSX matches for the reported section titles; locale key consistency passed; `yarn.cmd tsc --noEmit` passed; `yarn.cmd build` passed.

## 2026-06-27 - MyPage and Help translation logic
- Added a dedicated `mypage` namespace and registered it in `next-i18next` plus the shared i18n namespace helper.
- Translated MyPage route loading, sidebar menu sections, logout confirmation, profile labels/placeholders/success message, saved trips, recently viewed packages, agent package inventory tabs, my articles, write article header, follower/following lists, follow/unfollow buttons, and key Add/Edit Package actions.
- Expanded Help/CS translation coverage for popular topics and fallback FAQ categories/questions/answers while preserving backend-provided FAQ and notice content as dynamic data.
- Files: `public/locales/{en,kr,ru}/mypage.json`, `public/locales/{en,kr,ru}/community.json`, `next-i18next.config.js`, `libs/i18n.ts`, `pages/mypage/index.tsx`, `pages/cs/index.tsx`, `libs/components/mypage/*`, `libs/components/member/MemberFollowers.tsx`, `libs/components/member/MemberFollowings.tsx`, `libs/components/cs/Faq.tsx`.
- Validation: locale key consistency passed; exact phrase scan found no remaining TSX matches for the targeted MyPage/Help headings and empty states; `yarn.cmd tsc --noEmit` passed; `yarn.cmd build` passed.
- Remaining issue: deeper Add Tour Package field-level labels and validation strings still have some static English and should be translated in a focused form pass.

## 2026-06-27 - Help FAQ content translation fix
- Fixed `#pc-wrap .cs-page .faq-content` so known TourX FAQ categories use localized category labels and localized FAQ question/answer content even when backend FAQ data exists.
- Kept unknown/custom backend FAQ categories supported by falling back to their backend-provided titles and items.
- File: `libs/components/cs/Faq.tsx`.
- Validation: locale key consistency passed; `yarn.cmd tsc --noEmit` passed; `yarn.cmd build` passed.

## 2026-06-27 - Admin menu and admin page translation pass
- Removed visible top-level words from the admin sidebar menu while keeping translated `title` and `aria-label` text for accessibility; submenu labels remain translated for navigation clarity.
- Expanded admin translations for users, packages, community articles, comments, FAQ, and notice management tables, filters, status badges, confirmation dialogs, modal labels, validation messages, empty states, and action buttons.
- Added page-level admin namespace loading to admin community, comments, FAQ, and notice pages and included package/community namespaces in admin i18n loading for enum display labels.
- Files: `libs/components/admin/*`, `pages/_admin/community/index.tsx`, `pages/_admin/comments/index.tsx`, `pages/_admin/cs/faq.tsx`, `pages/_admin/cs/notice.tsx`, `libs/i18n.ts`, `public/locales/{en,kr,ru}/admin.json`.
- Validation: locale key consistency passed; `yarn.cmd tsc --noEmit` passed.
- Remaining issue: the legacy admin inquiry placeholder page still contains mock/static placeholder data and should be replaced with real inquiry API logic before deeper translation work.

## 2026-06-28 - Navbar package notification dropdown
- Added an authenticated notification dropdown to the shared TourX navbar with unread badge count, lazy-loaded notification list, loading/empty/error states, unread indicators, and package detail navigation.
- Integrated the live backend GraphQL notification API: `getMyUnreadNotificationCount`, `getMyNotifications`, and `markNotificationAsRead`.
- Added frontend notification types, Apollo query/mutation documents, localized notification UI copy, and responsive PC/mobile styling using existing TourX theme variables and dark-mode tokens.
- Clicking `View Package` now marks the notification as read, refetches the unread badge count, refreshes the opened notification list, and redirects to `/tour-package/detail?id={packageId}`.
- Files: `libs/components/notifications/NotificationDropdown.tsx`, `libs/components/Top.tsx`, `apollo/user/query.ts`, `apollo/user/mutation.ts`, `libs/types/notification/*`, `libs/enums/notification.enum.ts`, `scss/pc/main.scss`, `scss/mobile/main.scss`, `scss/pc/dark-mode.scss`, `public/locales/{en,kr,ru}/common.json`.
- Validation: backend schema introspection confirmed notification operations and fields; common locale JSON parse passed; `yarn.cmd tsc --noEmit` passed; PC/mobile Sass compiles passed; `yarn.cmd build` passed with the existing Browserslist update warning.
- Remaining issue: manual browser verification with real follower/package creation data is still recommended to confirm badge decrease and notification privacy against authenticated users.

## 2026-06-28 - Agent package edit image removal
- Added old-image removal support to the agent Add/Edit Tour Package form by removing selected image paths from the `packageImages` array before `updateTourPackage` submits.
- Added an accessible remove button on filled package image slots with light/dark mode styling and localized aria labels.
- Preserved existing upload limits, create/update GraphQL payload shape, and validation requiring at least one package image.
- Files: `libs/components/mypage/AddNewTourPackage.tsx`, `scss/pc/mypage/addNewTourPackage.scss`, `scss/pc/dark-mode.scss`, `public/locales/{en,kr,ru}/mypage.json`.
- Validation: `yarn.cmd tsc --noEmit` passed; PC Sass compile passed; MyPage locale key consistency passed.

## 2026-06-28 - About Us navbar link and About page sections
- Added `About Us` immediately after `Help` in the shared desktop and mobile `Top` navbar and the reusable common `Navbar` implementation.
- Reused the existing `/about` route and expanded the About page with explicit services, vision/why choose, and team sections while preserving the existing TourX layout and i18n loading.
- Added/updated `nav.about` and About page translation keys across `en`, `kr`, and `ru`.
- Files: `libs/components/Top.tsx`, `libs/components/common/Navbar.tsx`, `pages/about/index.tsx`, `public/locales/{en,kr,ru}/common.json`, `public/locales/{en,kr,ru}/about.json`, `scss/pc/about/about.scss`, `scss/pc/dark-mode.scss`.
- Validation: common/about locale key consistency passed; `yarn.cmd tsc --noEmit` passed; PC Sass compile passed.

## 2026-06-28 - Package detail Google Maps preview
- Added a reusable `PackageLocationMap` component for the Tour Package detail booking card using `packageAddress`, `packageCity`, `packageCountry`, and `packageTitle`.
- Replaced the old static `booking-card:before` map placeholder with a themed map preview that opens a centered modal with backdrop click, X close, ESC close, and an `Open in Google Maps` action.
- Uses the no-key Google Maps iframe URL `https://www.google.com/maps?q=...&output=embed` so package locations render inside TourX without requiring `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; fallback copy only appears when the package has no location fields.
- Redesigned the map modal as an Apple Maps-inspired glass floating card with blurred backdrop, compact floating header, large rounded iframe, bottom action bar, smooth fade/scale animation, responsive sizing, and dark-mode overlay support.
- Added localized package map labels for `en`, `kr`, and `ru` and kept light/dark styling tied to existing TourX CSS variables.
- Files: `libs/components/tourPackage/PackageLocationMap.tsx`, `pages/tour-package/detail.tsx`, `scss/pc/tourPackage/detail.scss`, `scss/pc/dark-mode.scss`, `public/locales/{en,kr,ru}/package.json`.
- Validation: package locale key consistency passed; `yarn.cmd tsc --noEmit` passed; PC Sass compile passed; `yarn.cmd build` passed with the existing Browserslist update warning.
- Remaining issue: manual browser verification with live package addresses is recommended to confirm Google iframe rendering in the local browser.

## 2026-06-28 - Footer navigation and Live Chat links
- Replaced placeholder footer Company links with the real navbar routes: Home, Tour Packages, Agents, Community, Help, and About Us.
- Updated Support links to use valid routes and changed Live Chat from a fake route into a `tourx:open-chat` event that opens the existing shared chat panel.
- Added newsletter email state, empty/invalid validation, localized success/error feedback, and preserved the existing frontend-only newsletter UI.
- Converted social icons to accessible external links and removed dead mobile app route links by rendering app labels without navigation.
- Added light/dark/mobile footer styling for link hover/focus states, the Live Chat button, newsletter messages, and disabled app labels.
- Files: `libs/components/Footer.tsx`, `libs/components/Chat.tsx`, `scss/pc/main.scss`, `scss/mobile/main.scss`, `scss/pc/dark-mode.scss`, `public/locales/{en,kr,ru}/footer.json`.
- Validation: footer locale key consistency passed; `yarn.cmd tsc --noEmit` passed; PC/mobile Sass compile passed.

## 2026-06-28 - Package filter SweetAlert no-results behavior
- Added shared Tour Package filter helpers to normalize, clean, validate, serialize, and parse package list query filters without changing the backend GraphQL shape.
- Updated the homepage header search to trim/remove empty filters, validate ranges, preflight `getTourPackages` with `limit: 1`, show a SweetAlert warning when no packages match, and redirect only when matching packages exist.
- Updated the package list page to initialize filters from URL query input through the same sanitizer and keep pagination/sorting URLs using the cleaned filter payload.
- Updated the package sidebar filters to preserve entered values, prevent repeated apply clicks, preflight matching packages, and show the localized no-results SweetAlert before routing.
- Added localized `common.alerts.noPackagesFound`, `common.alerts.noPackagesFoundForSearch`, `common.searchPackages`, and `common.alerts.invalidFilterInput` keys for `en`, `kr`, and `ru`.
- Files: `libs/utils/tourPackageFilter.ts`, `libs/components/homepage/HeaderFilter.tsx`, `libs/components/tourPackage/Filter.tsx`, `pages/tour-package/index.tsx`, `libs/sweetAlert.ts`, `public/locales/{en,kr,ru}/common.json`, `scss/pc/main.scss`.
- Validation: common locale key consistency passed; `yarn.cmd tsc --noEmit` passed; PC/mobile Sass compile passed.

## 2026-06-28 - Advanced filter modal text search
- Connected `.advanced-filter-modal .top div.search-input-box` to the existing package search flow with trim, empty-search ignore, loading guard, Enter submit, search-icon submit, and clear-search action.
- The advanced modal text search now preflights `getTourPackages` with `search.text`, keeps the modal open on zero results with a TourX SweetAlert warning, and redirects to `/tour-package?search=...` only when matches exist.
- Updated the package list page to read `router.query.search`, convert it into `TourPackagesInquiry.search.text`, keep the text visible in the package filter input, and preserve search pagination with `/tour-package?search=...&page=...`.
- Added localized `common.clearSearch` for `en`, `kr`, and `ru` and dark-mode styling for the new modal search/clear buttons.
- Files: `libs/components/homepage/HeaderFilter.tsx`, `pages/tour-package/index.tsx`, `libs/utils/tourPackageFilter.ts`, `scss/pc/main.scss`, `scss/pc/dark-mode.scss`, `public/locales/{en,kr,ru}/common.json`.
- Validation: common locale key consistency passed; `yarn.cmd tsc --noEmit` passed; PC/mobile Sass compile passed.

## 2026-06-28 - Professional mobile navigation system
- Added reusable mobile navigation components: `MobileTopNavbar`, `MobileNavDrawer`, and `MobileBottomNav`.
- Replaced the compact `Top` navbar branch with a hamburger top bar, TourX brand, avatar/profile link, slide-out drawer, and fixed bottom tab bar.
- Drawer includes Home, Packages, Agents, Community, My Page, Help, and About Us plus notification, theme toggle, and EN/KR/RU language controls with backdrop click and ESC close behavior.
- Bottom mobile tabs route to Explore `/`, Bookings `/mypage?category=recentlyVisited`, Saved `/mypage?category=myFavorites`, and Profile `/mypage`, falling back to `/account/join` for unauthenticated account-only tabs.
- Added mobile/tablet styling with theme variables, dark-mode compatible surfaces, safe-area bottom padding, active orange tab states, drawer animation, and no-overflow guards while preserving the desktop navbar branch.
- Added the app-level viewport meta tag for mobile-width rendering and safe-area support.
- Files: `libs/components/mobile/*`, `libs/components/Top.tsx`, `pages/_app.tsx`, `scss/mobile/main.scss`, `public/locales/{en,kr,ru}/common.json`.
- Validation: common locale key consistency passed; `yarn.cmd tsc --noEmit` passed; PC/mobile Sass compile passed; `yarn.cmd build` passed with the existing Browserslist update warning; headless screenshots confirmed the mobile top/bottom bars on compact widths and unchanged desktop navbar at 1440px.
