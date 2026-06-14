# Backend Migration: Property to TourPackage

## Current Project Summary

TourX is a NestJS GraphQL monorepo with two backend apps:

- `tourx-api`: GraphQL API, auth, members, agents, tour packages, likes, views, comments, follows, board articles, uploads, and sockets.
- `tourx-batch`: scheduled ranking and rollback jobs for tour packages and agents.

The current backend domain migration is a breaking conversion from the old real-estate `Property` catalog to TourX `TourPackage` catalog terminology.

## Migration Goal

- Replace active backend `Property` API, DTO, enum, schema, module, service, resolver, and collection names with `TourPackage` / package terminology.
- Keep `MemberType.USER`, `MemberType.AGENT`, and `MemberType.ADMIN` unchanged.
- Keep tour package ownership under `MemberType.AGENT`.
- Defer `Booking`, `Payment`, `Review`, `Wishlist`, `PackageImage`, and `PackageItinerary` modules to later work.

## Main Naming Changes

| Old Surface | Current Surface |
| --- | --- |
| `PropertyModule`, `PropertyResolver`, `PropertyService` | `TourPackageModule`, `TourPackageResolver`, `TourPackageService` |
| `Property`, `Properties` DTOs | `TourPackage`, `TourPackages` DTOs |
| `PropertyInput`, `PropertyUpdate` | `TourPackageInput`, `TourPackageUpdate` |
| `getProperty`, `getProperties` | `getTourPackage`, `getTourPackages` |
| `createProperty`, `updateProperty` | `createTourPackage`, `updateTourPackage` |
| `likeTargetProperty` | `likeTargetTourPackage` |
| `getAgentProperties` | `getAgentTourPackages` |
| Mongo model `Property` | Mongo model `TourPackage` |
| Mongo collection `properties` | Mongo collection `tourPackages` |
| `memberProperties` | `memberTours` |
| `Like/View/Comment/NotificationGroup.PROPERTY` | `PACKAGE` |

## Package Fields

The active package schema uses:

- `packageType`, `packageStatus`
- `packageTitle`, `packageCountry`, `packageCity`, `packageAddress`, `packageDesc`
- `packagePrice`, `packageCurrency`
- `durationDays`, `minPeople`, `maxPeople`
- `flightIncluded`, `hotelIncluded`, `guideIncluded`
- `packageViews`, `packageLikes`, `packageComments`, `packageRank`
- `packageImages`
- `memberId`
- `startDate`, `endDate`, `deletedAt`

Removed real-estate-only fields include rooms, beds, square area, rent, barter, constructed date, and sold date.

## Compatibility Notes

This is a breaking backend migration. Existing clients using old `Property` GraphQL names or the old `properties` collection must migrate to the new package API and `tourPackages` data model.
