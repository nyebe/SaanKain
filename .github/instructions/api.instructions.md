# API Instructions — SaanKain

This document defines how API routes must be implemented in **SaanKain**.

The API layer acts as an **orchestration layer**, connecting validation, parsing, external APIs, and ranking.

API routes must remain **small and predictable**.

---

# API Location

All API routes live in:

```
/app/api
```

Required endpoint:

```
/app/api/v1/execute/route.ts
```

---

# Endpoint Definition

Primary endpoint:

```
GET /api/v1/execute
```

Example request:

```
/api/v1/execute?message=cheap sushi near LA open now&code=pioneerdevai
```

Required parameters:

| Parameter | Required | Description                   |
| --------- | -------- | ----------------------------- |
| message   | yes      | Natural language search query |
| code      | yes      | API access code               |

---

# API Responsibilities

The API route must only perform orchestration.

Steps must always follow this order:

```
1 validate request
2 parse message
3 call restaurant search
4 rank results
5 return response
```

The API must **never contain business logic**.

Business logic must live inside:

```
/lib/parser
/lib/foursquare
/lib/ranking
/lib/validation
```

---

# Allowed Imports

The API route may import from:

```
@/lib/parser
@/lib/foursquare
@/lib/ranking
@/lib/validation
@/types
```

The API route must not import UI components.

---

# Input Validation

Validation must occur before any processing.

Validation logic must live in:

```
/lib/validation/validateExecuteQuery.ts
```

Validation checks:

```
code parameter exists
code parameter equals pioneerdevai
message parameter exists
message is string
message length < 500 characters
```

If validation fails, return structured error.

Example response:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "message parameter is required"
  }
}
```

---

# Authentication Gate

The endpoint is protected by a simple code gate.

Valid code:

```
pioneerdevai
```

If invalid:

```
401 Unauthorized
```

Response example:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid code"
  }
}
```

---

# Parsing Step

After validation, the API must parse the message.

Parser module:

```
/lib/parser/parseMessage.ts
```

Function:

```ts
parseMessage(message: string): ParsedSearch
```

The API must pass the raw message string.

The parser returns a `ParsedSearch` object.

---

# Restaurant Search Step

After parsing, the API calls the Foursquare search module.

Function:

```ts
searchPlaces(parsed: ParsedSearch): Promise<RestaurantResult[]>
```

Location:

```
/lib/foursquare/searchPlaces.ts
```

This module handles:

```
API request
authentication
response validation
normalization
```

The API must never call external services directly.

---

# Ranking Step

After retrieving restaurant results, the API applies ranking.

Location:

```
/lib/ranking/rankResults.ts
```

Function:

```ts
rankResults(results: RestaurantResult[], parsed: ParsedSearch)
```

Responsibilities:

```
prioritize cuisine match
prioritize price match
prioritize open restaurants
prioritize rating when requested
```

Ranking must return sorted results.

---

# Response Structure

Successful responses must follow this structure.

Example:

```json
{
  "success": true,
  "message": "cheap sushi near downtown LA open now",
  "parsed": {
    "cuisine": "sushi",
    "locationText": "downtown LA",
    "priceLevel": 1,
    "openNow": true
  },
  "results": []
}
```

Fields:

| Field   | Description                |
| ------- | -------------------------- |
| success | request success indicator  |
| message | original query             |
| parsed  | structured interpretation  |
| results | normalized restaurant list |

---

# Error Handling

Errors must always return structured responses.

Types of errors:

```
validation errors
authentication errors
external API errors
unexpected runtime errors
```

The API must never expose stack traces.

Example internal error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Unexpected server error"
  }
}
```

---

# Upstream API Failure

If the Foursquare API fails:

```
502 Bad Gateway
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "UPSTREAM_ERROR",
    "message": "Failed to retrieve data from Foursquare API"
  }
}
```

---

# Response Headers

Responses must be JSON.

Recommended headers:

```
Content-Type: application/json
```

Future improvements may include caching headers.

---

# API Logging (Optional)

The API may log:

```
incoming query
parsed parameters
result count
upstream API failures
```

Sensitive data must never be logged.

---

# Testing Requirements

API tests must exist.

Location:

```
/tests/api/v1/execute.test.ts
```

Required scenarios:

```
valid request returns success
invalid code returns 401
missing message returns 400
upstream API failure handled
```

External API calls must be mocked.

Tests must never call the real Foursquare API.

---

# Performance Expectations

Typical API response time should remain under:

```
2 seconds
```

This includes the Foursquare API request.

---

# Future API Enhancements

Potential future endpoints:

```
GET /api/place/[id]
GET /api/suggestions
POST /api/search-history
```

These are not required for the current system.

---

# Golden Rule

The API layer is **not a logic layer**.

It only coordinates modules.

If code exceeds **~80 lines**, move logic to `/lib`.
