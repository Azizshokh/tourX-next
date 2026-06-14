# Useful Prompts

## Verify Package Migration

```text
Verify the current TourX backend Property to TourPackage migration.

Do not change source code. Confirm that active backend source uses TourPackage/package terminology, MemberType remains USER/AGENT/ADMIN, package ownership still uses AGENT, and no old Property/property/properties/memberProperties symbols remain outside historical docs.
```

## Frontend Package Migration

```text
Plan the frontend migration to the current TourX TourPackage backend API.

Do not preserve old Property GraphQL operations. Replace list/detail/create/update/favorites/visited/agent dashboard flows with package operations and package fields. Keep MemberType values unchanged.
```

## Next ER Modules

```text
Plan the next TourX backend ER module after the core TourPackage migration.

Choose one module from Booking, Payment, Review, Wishlist, PackageImage, or PackageItinerary. Preserve the existing NestJS GraphQL resolver/service/module pattern and keep MemberType.USER, MemberType.AGENT, and MemberType.ADMIN unchanged.
```

## Data Migration

```text
Create a MongoDB data migration plan from old properties documents to tourPackages documents.

Map old fields only where safe, identify fields that cannot be inferred, preserve member ownership under MemberType.AGENT, and include rollback and validation steps. Do not implement the migration until approved.
```
