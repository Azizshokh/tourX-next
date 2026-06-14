# Migration Decisions

## Current Architectural Decisions

| Decision | Current Choice |
| --- | --- |
| Migration mode | Breaking backend migration from `Property` to `TourPackage`. |
| Member roles | Keep `MemberType.USER`, `MemberType.AGENT`, and `MemberType.ADMIN` unchanged. |
| Package owner role | `MemberType.AGENT` owns and manages tour packages. |
| Main package enum | `PackageType`: `ADVENTURE`, `CULTURAL`, `RELIGIOUS`, `BUSINESS`, `FAMILY`, `HONEYMOON`, `CRUISE`, `OTHER`. |
| Package lifecycle | `PackageStatus`: `ACTIVE`, `CLOSED`, `DELETE`. |
| Mongo collection | Use `tourPackages`; the old `properties` collection is not kept as a compatibility alias. |
| Social target groups | Use `PACKAGE` for likes, views, comments, and notifications. |
| Deferred ER modules | Booking, payment, review, wishlist, package images, and itinerary modules are later phases. |

## Validation Decisions

- Use `npx tsc -p apps/tourx-api/tsconfig.app.json --noEmit`.
- Use `npx tsc -p apps/tourx-batch/tsconfig.app.json --noEmit`.
- Use `npm test -- --runInBand` for focused package and batch tests.
- Use `npm run build`.
- Do not run `npm run lint` unless broad source rewriting is acceptable, because the script includes `--fix`.
