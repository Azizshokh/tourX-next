# Frontend Migration: TourPackage API

## Current Backend Contract

The backend has completed a breaking migration from `Property` to `TourPackage`. The frontend must now use package-facing GraphQL operations and fields directly; old Property compatibility aliases are not preserved.

## Required Frontend Changes

| Old Frontend Surface | New Target |
| --- | --- |
| Property list/detail pages | Tour package list/detail pages |
| `getProperties`, `getProperty` | `getTourPackages`, `getTourPackage` |
| `createProperty`, `updateProperty` | `createTourPackage`, `updateTourPackage` |
| `getAgentProperties` | `getAgentTourPackages` |
| `likeTargetProperty` | `likeTargetTourPackage` |
| Property form fields | Package title, country, city, address, description, price, currency, duration, people limits, inclusions, dates, images |
| `memberProperties` display | `memberTours` display |

## Removed UI Fields

Remove or replace old real-estate inputs and labels:

- rooms
- beds
- square area
- rent
- barter
- constructed date
- sold status

## Validation Checklist

- Regenerate or update GraphQL documents against the current backend schema.
- Package list/detail pages load from `getTourPackages` and `getTourPackage`.
- Agent dashboard uses `getAgentTourPackages`.
- Create/update forms submit `TourPackageInput` and `TourPackageUpdate`.
- Favorites and visited pages show package data.
- No active frontend source still calls old Property operations.
