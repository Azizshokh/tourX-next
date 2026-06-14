# Backend Migration: Nestar -> TourX

## Original Project Summary

| Area | Original Nestar State |
| --- | --- |
| Framework | NestJS monorepo with GraphQL API and scheduled batch app |
| API app | `apps/nestar-api` |
| Batch app | `apps/nestar-batch` |
| Primary domain | Real-estate `Property` listings managed by `Agent` members |
| Database | MongoDB through Mongoose |
| Main collections | `properties`, `members`, `likes`, `views`, `comments`, `follows`, `boardArticles`, `notifications` |

The original backend is a NestJS GraphQL monorepo. It contains a public API server, a batch server, Mongoose schemas, GraphQL DTOs/resolvers/services, auth guards, and social modules such as likes, views, comments, follows, and board articles.

## New Project Summary

| Area | Current TourX State |
| --- | --- |
| Platform name | TourX |
| API app | `apps/tourx-api` |
| Batch app | `apps/tourx-batch` |
| Package name | `tourx` |
| Domain model | Unchanged: `Property` / `Agent` |
| Data model | Unchanged: existing MongoDB collections and schema fields are preserved |

TourX is currently a safe project/app rename layer. It updates visible project identifiers, app folders, scripts, config paths, docs, and server greeting labels. It does not convert business logic from real estate to travel.

## Backend Migration Goal

The accepted migration goal for the current state is:

> Rename visible backend project/app identifiers from Nestar to TourX while preserving all public APIs, database collections, schema fields, and business behavior.

This means compatibility with existing Nestar clients and existing MongoDB data is more important than introducing new Tour/Guide terminology.

## Naming Changes

| Item | Before | After |
| --- | --- | --- |
| Root package name | `nestar` | `tourx` |
| API app folder | `apps/nestar-api` | `apps/tourx-api` |
| Batch app folder | `apps/nestar-batch` | `apps/tourx-batch` |
| Nest project | `nestar-api` | `tourx-api` |
| Nest batch project | `nestar-batch` | `tourx-batch` |
| Production API path | `dist/apps/nestar-api/main` | `dist/apps/tourx-api/main` |
| Production batch path | `dist/apps/nestar-batch/main` | `dist/apps/tourx-batch/main` |
| API welcome text | `Welcome to Nestar Rest API Server!!!` | `Welcome to TourX Rest API Server!!!` |
| Batch welcome text | `Welcome to Nestar BATCH Server!!!` | `Welcome to TourX BATCH Server!!!` |

## Module Changes

Only app/project naming changed. Domain modules intentionally remain the same.

| Module | Current Status | Notes |
| --- | --- | --- |
| `PropertyModule` | Preserved | Main listing domain remains real-estate `Property` |
| `MemberModule` | Preserved | `MemberType.AGENT` remains the seller/owner role |
| `AuthModule` | Preserved | Guards/decorators and token behavior unchanged |
| `LikeModule` | Preserved | `LikeGroup.PROPERTY` remains unchanged |
| `ViewModule` | Preserved | `ViewGroup.PROPERTY` remains unchanged |
| `CommentModule` | Preserved | `CommentGroup.PROPERTY` remains unchanged |
| `BoardArticleModule` | Preserved | Article behavior unchanged |
| `FollowModule` | Preserved | Follow behavior unchanged |
| `SocketModule` | Preserved | Socket behavior unchanged |
| Batch module | Preserved | Ranking jobs still compute property and agent rank |

## GraphQL Changes

No GraphQL domain operation names were changed.

| GraphQL Surface | Current Decision |
| --- | --- |
| `createProperty` | Preserved |
| `getProperty` | Preserved |
| `getProperties` | Preserved |
| `updateProperty` | Preserved |
| `likeTargetProperty` | Preserved |
| `getAgentProperties` | Preserved |
| `getAgents` | Preserved |
| `Property`, `Properties` object types | Preserved |
| `PropertyInput`, `PropertyUpdate` input types | Preserved |
| `PropertyType`, `PropertyStatus`, `PropertyLocation` enums | Preserved |
| `MemberType.AGENT` | Preserved |

Frontend clients should not need GraphQL query/mutation rewrites for this safe rename layer.

## MongoDB Collection and Schema Changes

No MongoDB migration was run, and no collection rename is part of the current state.

| Collection / Schema Surface | Current Status |
| --- | --- |
| `properties` collection | Preserved |
| `Property.model.ts` | Preserved |
| `propertyType`, `propertyStatus`, `propertyLocation` | Preserved |
| `propertyAddress`, `propertyTitle`, `propertyPrice` | Preserved |
| `propertySquare`, `propertyBeds`, `propertyRooms` | Preserved |
| `propertyViews`, `propertyLikes`, `propertyComments`, `propertyRank` | Preserved |
| `memberProperties` | Preserved |
| `likes.likeGroup = PROPERTY` | Preserved |
| `views.viewGroup = PROPERTY` | Preserved |
| `comments.commentGroup = PROPERTY` | Preserved |

The earlier deeper Tour/Guide migration path was corrected and should not be treated as current architecture.

## Compatibility Notes

- Existing clients using Property/Agent GraphQL operations remain compatible.
- Existing MongoDB documents in `properties` remain compatible.
- Existing enum values such as `AGENT`, `PROPERTY`, and `SOLD` remain compatible.
- No migration script should be run for this safe rename layer.
- Environment database targets should be reviewed manually before changing URI database names, because renaming a database in a URI can redirect runtime data.
