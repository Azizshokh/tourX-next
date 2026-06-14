# Next Steps

## Backend

| Priority | Task | Purpose |
| --- | --- | --- |
| 1 | Decide and implement a data migration from old `properties` documents to `tourPackages` if existing data must be preserved. | The code migration is breaking and does not move MongoDB data. |
| 2 | Add `Booking` and `Payment` modules from the ER model. | Enable purchase/reservation flow after the package catalog is stable. |
| 3 | Add `Review`, `Wishlist`, `PackageImage`, and `PackageItinerary` modules. | Complete the rest of the ER model around packages. |
| 4 | Expand GraphQL smoke/e2e coverage for package queries and mutations. | Validate runtime schema and resolver integration beyond unit tests. |
| 5 | Plan lint cleanup separately. | Avoid broad unrelated rewrites from `npm run lint --fix`. |

## Frontend

| Priority | Task | Purpose |
| --- | --- | --- |
| 1 | Replace all old Property GraphQL documents with TourPackage operations. | The backend no longer keeps Property API compatibility. |
| 2 | Update package create/edit forms for package fields. | Remove rooms, beds, square, rent, barter, and constructed date from UI. |
| 3 | Update favorites and visited pages to use package terminology. | Align user-facing flows with package data. |
| 4 | Update agent dashboard pages from properties to tour packages. | Keep `AGENT` role but change managed catalog language. |

## Documentation

Keep `docs/ai` as the source of truth for the active migration state. Update completed tasks after each major ER module is added.
