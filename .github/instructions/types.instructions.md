# Types Instructions — SaanKain

This document defines how **TypeScript types must be created, organized, and used** in the SaanKain codebase.

The goal is to maintain:

```
type safety
consistency
clarity
maintainability
```

Types must act as the **single source of truth for data structures** used throughout the system.

---

# Types Location

All shared types must live in:

```text
/types
```

Expected structure:

```text
/types
├── search.ts
├── restaurant.ts
├── api.ts
```

Types must not be scattered across the project.

If a type is reused across modules, it belongs in `/types`.

---

# Import Convention

Types must always be imported using root paths.

Correct:

```ts
import { ParsedSearch } from "@/types/search"
```

Incorrect:

```ts
import { ParsedSearch } from "../../types/search"
```

Deep relative imports must be avoided.

---

# Type Design Principles

Types must be:

```
explicit
predictable
minimal
stable
```

Avoid overly generic structures.

Example of bad design:

```ts
type Result = Record<string, unknown>
```

This is not allowed.

---

# Prohibited Types

The following must never appear in the codebase:

```
any
unknown (unless explicitly justified)
object
Record<string, any>
```

If a type cannot yet be determined, use a TODO marker:

```ts
// TODO: define type for X
```

But this must be resolved quickly.

---

# Core Types

The system relies on three primary type groups.

```
search types
restaurant types
API response types
```

Each group must be defined in a separate file.

---

# Search Types

Location:

```text
/types/search.ts
```

Defines how parsed search parameters are represented.

Example:

```ts
export type ParsedSearch = {
  rawMessage: string
  cuisine?: string
  locationText?: string
  priceLevel?: 1 | 2 | 3 | 4
  openNow?: boolean
  sortBy?: "relevance" | "rating"
}
```

Rules:

* optional fields must remain optional
* do not introduce unnecessary nesting
* keep the structure stable

---

# Restaurant Types

Location:

```text
/types/restaurant.ts
```

Represents normalized restaurant data returned by the system.

Example:

```ts
export type RestaurantResult = {
  fsqId: string
  name: string
  address: string | null
  locality: string | null
  region: string | null
  category: string | null
  rating?: number | null
  price?: number | null
  isOpen?: boolean | null
  distance?: number | null
}
```

Important rule:

This structure represents the **internal normalized format**.

External API responses must never be used directly.

---

# API Types

Location:

```text
/types/api.ts
```

Defines the structure of API responses.

Example success response:

```ts
export type ExecuteSuccessResponse = {
  success: true
  message: string
  parsed: ParsedSearch
  results: RestaurantResult[]
}
```

Example error response:

```ts
export type ExecuteErrorResponse = {
  success: false
  error: {
    code: string
    message: string
  }
}
```

Combined response type:

```ts
export type ExecuteResponse =
  | ExecuteSuccessResponse
  | ExecuteErrorResponse
```

---

# External API Types

External APIs often return complex payloads.

These must never leak into the system.

Instead:

1. Define a **minimal interface** representing the parts used.
2. Transform external responses into internal types.

Example:

```ts
type FoursquarePlace = {
  fsq_id: string
  name: string
  location?: {
    address?: string
    locality?: string
    region?: string
  }
  categories?: {
    name: string
  }[]
  price?: number
  distance?: number
}
```

This type must exist **only inside the Foursquare module**.

It must not appear outside:

```
/lib/foursquare
```

---

# Type Ownership

Types should follow ownership boundaries.

Example:

| Type             | Owner           |
| ---------------- | --------------- |
| ParsedSearch     | parser          |
| RestaurantResult | transform layer |
| ExecuteResponse  | API             |

Modules should not redefine the same type.

---

# Optional Fields

Optional fields must be used carefully.

Example:

Correct:

```ts
rating?: number | null
```

Incorrect:

```ts
rating: number | undefined
```

The preferred pattern is:

```
optional property + null allowed
```

---

# Enum Usage

Enums should be avoided unless necessary.

Prefer literal union types.

Example:

Preferred:

```ts
sortBy?: "relevance" | "rating"
```

Avoid:

```ts
enum SortBy {
  Relevance,
  Rating
}
```

Literal unions are simpler and easier to maintain.

---

# Type Expansion Rules

When expanding types:

1. preserve backward compatibility
2. avoid renaming existing properties
3. add optional fields rather than breaking fields

Breaking type changes should be avoided.

---

# Naming Conventions

Type names must follow:

```
PascalCase
```

Examples:

```
ParsedSearch
RestaurantResult
ExecuteResponse
```

Avoid:

```
searchType
restaurant_result
```

---

# Testing Types

Types must be validated indirectly through tests.

Examples:

```
parser tests validate ParsedSearch
transform tests validate RestaurantResult
API tests validate ExecuteResponse
```

Types themselves do not require direct tests, but they must support tested behavior.

---

# Future Type Extensions

Future types may include:

```
PlaceDetails
SearchSuggestion
UserSearchHistory
```

These must follow the same structure rules.

---

# Golden Rule

Types must always reflect **real data structures used by the system**.

They must never exist only for theoretical completeness.

Types that are not used should not be created.
