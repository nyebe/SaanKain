# SaanKain — API Contract

This document defines the **public API interface** of SaanKain.

The API allows clients to submit a **natural language restaurant search query** and receive structured restaurant results.

The API is designed to be:

* predictable
* type-safe
* easy to test
* easy to integrate

---

# Base URL

Example deployed URL:

```
https://saankain.vercel.app
```

Local development:

```
http://localhost:3000
```

---

# Primary Endpoint

```
GET /api/execute
```

This endpoint processes natural language restaurant queries.

---

# Query Parameters

| Parameter | Required | Description                   |
| --------- | -------- | ----------------------------- |
| `message` | yes      | Natural language search query |
| `code` | yes      | API access code               |

Example request:

```
/api/execute?message=cheap sushi near downtown LA open now&code=pioneerdevai
```

---

# Request Example

```
GET /api/execute?message=Find%20me%20a%20cheap%20sushi%20restaurant%20in%20downtown%20Los%20Angeles%20that%20is%20open%20now&code=pioneerdevai
```

---

# Request Validation Rules

The API validates:

### Code Validation

```
code must equal pioneerdevai
```

If invalid:

```
401 Unauthorized
```

---

### Message Validation

Rules:

```
must exist
must be a string
must not be empty
must be less than 500 characters
```

Invalid requests return:

```
400 Bad Request
```

---

# Response Structure

Successful responses follow this structure.

```json
{
  "success": true,
  "message": "cheap sushi near downtown LA open now",
  "parsed": {
    "cuisine": "sushi",
    "locationText": "downtown LA",
    "priceLevel": 1,
    "openNow": true,
    "sortBy": "relevance"
  },
  "results": []
}
```

---

# Parsed Search Object

The parsed search structure represents the interpreted user intent.

Example:

```json
{
  "cuisine": "sushi",
  "locationText": "downtown LA",
  "priceLevel": 1,
  "openNow": true,
  "sortBy": "relevance"
}
```

---

# ParsedSearch Type

```ts
type ParsedSearch = {
  rawMessage: string
  cuisine?: string
  locationText?: string
  priceLevel?: 1 | 2 | 3 | 4
  openNow?: boolean
  sortBy?: "relevance" | "rating"
}
```

---

# Restaurant Result Object

Restaurant results are normalized before being returned.

Example:

```json
{
  "fsqId": "4abc123",
  "name": "Sushi Place",
  "address": "123 Main St",
  "locality": "Los Angeles",
  "region": "CA",
  "category": "Sushi Restaurant",
  "rating": 8.6,
  "price": 1,
  "isOpen": true,
  "distance": 540
}
```

---

# RestaurantResult Type

```ts
type RestaurantResult = {
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

---

# Success Response

Example response:

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
  "results": [
    {
      "fsqId": "4abc123",
      "name": "Sushi Place",
      "address": "123 Main St",
      "locality": "Los Angeles",
      "region": "CA",
      "category": "Sushi Restaurant",
      "rating": 8.6,
      "price": 1,
      "isOpen": true,
      "distance": 540
    }
  ]
}
```

---

# Error Responses

All errors follow a consistent format.

---

## Invalid Code

```
401 Unauthorized
```

Example:

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

## Missing Message

```
400 Bad Request
```

Example:

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

## Upstream API Failure

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

# API Behavior Rules

The API must follow these rules.

### Rule 1 — Deterministic Parsing

The system must produce a consistent parsed structure for the same input.

---

### Rule 2 — No Raw Third-Party Data

External API responses must never be returned directly.

All responses must be normalized.

---

### Rule 3 — Stable Response Structure

The response structure must remain stable even if internal logic changes.

---

### Rule 4 — Safe Failure

Unexpected errors must return structured responses.

Never expose stack traces.

---

# Example End-to-End Flow

User query:

```
Find me a cheap sushi restaurant in downtown Los Angeles open now
```

Processing steps:

```
1. API receives request
2. Validate code
3. Validate message
4. Parse message
5. Construct Foursquare query
6. Call Foursquare API
7. Normalize restaurant results
8. Rank results
9. Return response
```

---

# Rate Limiting (Future)

Future versions may include:

```
request throttling
API caching
per-IP limits
```

These are not required in the current version.

---

# Future API Extensions

Potential future endpoints:

```
GET /api/place/{id}
GET /api/suggestions
POST /api/search-history
```

These endpoints are not part of the current system.

---

# Final Principle

The API contract is **stable even if internal architecture evolves**.

Clients should never depend on internal implementation details.
