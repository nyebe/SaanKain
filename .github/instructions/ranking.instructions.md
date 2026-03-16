# Ranking Instructions — SaanKain

This document defines how result ranking must work in **SaanKain**.

The ranking layer improves result relevance after data is returned from the Foursquare search module.

Its purpose is to ensure the system does not blindly trust raw upstream ordering when the user has expressed clear intent such as:

* cheap
* open now
* highly rated
* specific cuisine

---

# Module Location

Ranking logic must live only in:

```text
/lib/ranking
```

Expected file:

```text
/lib/ranking/rankResults.ts
```

No ranking logic may live inside:

```text
/app/api
/components
/lib/foursquare
/lib/parser
```

---

# Responsibilities

The ranking module must:

1. accept normalized restaurant results
2. accept parsed user intent
3. compute relevance scores
4. sort results by score
5. return ranked results

The module must not:

* call external APIs
* parse natural language
* mutate the original raw upstream payload

---

# Primary Function

Main function:

```ts
rankResults(results: RestaurantResult[], parsed: ParsedSearch): RestaurantResult[]
```

Location:

```text
/lib/ranking/rankResults.ts
```

The function must be deterministic.

The same inputs must always produce the same output.

---

# Inputs

The ranking function receives:

### Results

Normalized restaurant data:

```ts
RestaurantResult[]
```

### Parsed Search

Structured user intent:

```ts
ParsedSearch
```

Example:

```ts
{
  rawMessage: "cheap sushi near makati open now",
  cuisine: "sushi",
  locationText: "makati",
  priceLevel: 1,
  openNow: true,
  sortBy: "relevance"
}
```

---

# Ranking Philosophy

Ranking must reflect **user intent first**, not raw API order.

Example:

If the user asks for:

```text
cheap sushi open now
```

then results matching:

* sushi
* cheap price
* open now

must rank above generic restaurants that merely contain some related signal.

---

# Scoring Model

Ranking should use a simple additive scoring system.

Recommended signals:

| Signal                       |        Suggested Score |
| ---------------------------- | ---------------------: |
| category/cuisine match       |                     +4 |
| price match                  |                     +3 |
| open status match            |                     +2 |
| high rating when requested   |                     +2 |
| distance available and lower |        small tie-break |
| missing relevant signal      |                      0 |
| clear mismatch               | negative score allowed |

This scoring system should remain simple and readable.

Do not introduce weighted statistical models.

---

# Cuisine Matching

If `parsed.cuisine` exists, rank higher when the result appears to match that cuisine.

Check against:

* `category`
* `name` if useful as fallback

Example:

```text
parsed.cuisine = "sushi"
category = "Sushi Restaurant"
→ strong match
```

Cuisine comparison must be:

```text
case-insensitive
substring-safe
```

Avoid overly complex fuzzy matching unless explicitly requested.

---

# Price Matching

If `parsed.priceLevel` exists, rank higher when:

```text
result.price === parsed.priceLevel
```

Partial relaxation may be added later, but version 1 should prefer exact match.

If price is missing:

```text
do not penalize heavily
```

Missing price should not destroy otherwise relevant results.

---

# Open Status Matching

If `parsed.openNow === true`, prioritize restaurants where:

```text
result.isOpen === true
```

If open status is unavailable:

```text
treat as neutral
```

Do not assume closed.

---

# Rating Preference

If:

```text
parsed.sortBy === "rating"
```

then highly rated restaurants should receive a ranking boost.

Recommended rule:

* ratings above a chosen threshold receive bonus points
* higher rating sorts ahead when scores tie

If rating is missing:

```text
neutral
```

Do not automatically discard unrated results.

---

# Distance Tie-Breaking

Distance should be used as a tie-break, not a primary ranking signal, unless explicitly requested in the future.

Rule:

* among similarly scored results, nearer distance ranks higher
* missing distance is neutral

---

# Sorting Rules

Sorting priority should follow:

1. total relevance score descending
2. rating descending if rating-based intent exists
3. distance ascending if available
4. stable fallback order

This helps avoid unpredictable ordering.

---

# Stable Behavior

Ranking must be stable.

Two equal results should not reorder unpredictably across executions.

If needed, preserve original index and use it as the final tie-break.

---

# Mutation Rules

Do not mutate the input array directly.

Preferred:

```ts
return [...results].sort(...)
```

If a score needs to be computed, use an internal temporary structure.

Do not expose score fields in the final API response unless explicitly requested.

---

# Internal Helpers

If ranking logic grows, split helpers inside the ranking module.

Allowed helper examples:

```text
scoreCuisineMatch
scorePriceMatch
scoreOpenStatus
scoreRatingPreference
compareDistance
```

Keep each helper focused and readable.

---

# Example Behavior

User input:

```text
Find me a cheap sushi restaurant in downtown Los Angeles that is open now and has strong reviews
```

Parsed object:

```ts
{
  cuisine: "sushi",
  locationText: "downtown Los Angeles",
  priceLevel: 1,
  openNow: true,
  sortBy: "rating"
}
```

Expected ranking behavior:

* sushi restaurants above non-sushi
* cheap restaurants above expensive ones
* open restaurants above unknown/closed
* higher-rated sushi restaurants above lower-rated sushi restaurants

---

# Limitations

Version 1 ranking intentionally avoids:

```text
machine learning ranking
semantic embeddings
personalization
history-based tuning
```

The goal is:

```text
predictability
readability
testability
```

---

# Testing Requirements

Ranking tests must exist.

Location:

```text
/tests/ranking/rankResults.test.ts
```

Required scenarios:

```text
cuisine match ranks above non-match
price match boosts exact match
open restaurants rank above unknown when openNow is requested
high rating boosts results when sortBy is rating
distance breaks ties
stable ordering is preserved for equal scores
```

Use mocked normalized `RestaurantResult[]`.

Do not depend on raw Foursquare payloads in ranking tests.

---

# Example Test Cases

### Case 1 — Cuisine preference

Input:

* sushi place
* burger place

Parsed:

* cuisine = sushi

Expected:

* sushi place ranks first

---

### Case 2 — Price preference

Input:

* sushi place price 1
* sushi place price 3

Parsed:

* priceLevel = 1

Expected:

* price 1 ranks first

---

### Case 3 — Rating preference

Input:

* sushi place rating 8.9
* sushi place rating 7.2

Parsed:

* sortBy = rating

Expected:

* rating 8.9 ranks first

---

# Golden Rule

Ranking must be:

```text
simple
deterministic
explainable
```

A reviewer should be able to understand why one result ranked above another without reading a research paper.

---