# Foursquare Instructions — SaanKain

This document defines the rules for integrating with the **Foursquare Places API**.

All external API communication must follow these guidelines.

---

# Module Location

All Foursquare logic must live inside:

```
/lib/foursquare
```

Expected structure:

```
/lib/foursquare
├── client.ts
├── searchPlaces.ts
└── transform.ts
```

No other part of the system may call Foursquare directly.

---

# Responsibilities

The Foursquare module is responsible for:

```
building API requests
sending HTTP requests
handling authentication
validating responses
normalizing results
```

The module must **not perform parsing or ranking logic**.

---

# API Client

File:

```
/lib/foursquare/client.ts
```

Purpose:

Provide a reusable HTTP client configured for the Foursquare API.

Base URL:

```
https://api.foursquare.com/v3
```

The client must include the API key in headers.

Example header:

```
Authorization: <FOURSQUARE_API_KEY>
```

The API key must come from environment variables.

Never hardcode keys.

---

# Environment Variables

Required variable:

```
FOURSQUARE_API_KEY
```

If the key is missing, the client must throw an error.

Example behavior:

```
throw new Error("FOURSQUARE_API_KEY not configured")
```

Environment variables must never be committed to the repository.

---

# Place Search Endpoint

The system uses the **Place Search API**.

Endpoint:

```
GET /places/search
```

Documentation reference:

```
https://docs.foursquare.com/fsq-developers-places/reference/place-search
```

---

# Search Parameters

The following parameters may be used:

| Parameter | Purpose                    |
| --------- | -------------------------- |
| query     | cuisine or restaurant type |
| near      | location text              |
| open_now  | filter open places         |
| price     | price tier                 |
| limit     | number of results          |

Example request:

```
/places/search?query=sushi&near=Los%20Angeles&open_now=true&limit=10
```

The module must only send parameters that exist in the parsed search object.

---

# Search Function

Primary function:

```ts
searchPlaces(parsed: ParsedSearch): Promise<RestaurantResult[]>
```

Location:

```
/lib/foursquare/searchPlaces.ts
```

Responsibilities:

```
convert parsed search to API parameters
send HTTP request
receive API response
pass response to transform layer
return normalized results
```

The function must **never return raw API responses**.

---

# Result Transformation

File:

```
/lib/foursquare/transform.ts
```

Purpose:

Convert raw Foursquare data into internal result objects.

Example transformation:

External response:

```
response.results[]
```

Internal result:

```ts
RestaurantResult
```

Transformation must extract only relevant fields.

Example mapping:

| Foursquare Field   | Internal Field |
| ------------------ | -------------- |
| fsq_id             | fsqId          |
| name               | name           |
| location.address   | address        |
| location.locality  | locality       |
| location.region    | region         |
| categories[0].name | category       |
| price              | price          |
| distance           | distance       |

If fields are missing, return `null`.

---

# Restaurant Result Type

Location:

```
/types/restaurant.ts
```

Example type:

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

The transform layer must produce objects of this type.

---

# Error Handling

External API errors must be handled safely.

Possible failures:

```
network timeout
invalid API response
rate limit
authentication failure
```

The module must throw a controlled error.

Example:

```
throw new Error("FOURSQUARE_API_ERROR")
```

The API route is responsible for converting this into an HTTP response.

---

# Timeouts

API requests must include a timeout.

Recommended:

```
5 seconds
```

If the timeout is exceeded, the request must fail gracefully.

---

# Result Limits

The search request should limit results.

Recommended default:

```
limit = 10
```

This prevents unnecessary large responses.

---

# Logging

If logging is implemented, the module may log:

```
request parameters
API response status
error messages
```

Never log:

```
API keys
sensitive environment variables
```

---

# Testing Requirements

Tests must validate the transform logic.

Test location:

```
/tests/foursquare/transform.test.ts
```

Example tests:

```
valid API response → correct RestaurantResult mapping
missing fields → null values
empty results → empty array
```

Mock API responses instead of calling the real API.

---

# Future Extensions

Possible enhancements include:

```
place details endpoint
cuisine category filtering
distance sorting
result caching
rate limit handling
```

These must be implemented without breaking the current interface.

---

# Architecture Rule

External services must always be isolated.

No code outside:

```
/lib/foursquare
```

may call the Foursquare API directly.

---

# Golden Rule

The Foursquare module must be:

```
predictable
testable
isolated
```

It should behave like a **pure data provider** for the rest of the system.