# Parser Instructions — SaanKain

This document defines the **rules, structure, and responsibilities** of the parser module.

The parser converts **natural language restaurant queries** into a structured object used by the system.

Location of parser module:

```text
/lib/parser
```

Files expected:

```text
/lib/parser
├── parseMessage.ts
└── rules.ts
```

---

# Purpose

The parser translates user input such as:

```
Find me a cheap sushi restaurant in downtown Los Angeles that is open now
```

into structured search parameters:

```json
{
  "rawMessage": "Find me a cheap sushi restaurant in downtown Los Angeles that is open now",
  "cuisine": "sushi",
  "locationText": "downtown Los Angeles",
  "openNow": true,
  "sortBy": "relevance"
}
```

The parser is **deterministic and rule-based**.

LLM parsing is **not required** and must not replace the rule system unless explicitly instructed.

---

# Parser Responsibilities

The parser must:

1. Accept a raw message string
2. Normalize the message
3. Detect keywords and phrases
4. Extract structured parameters
5. Return a `ParsedSearch` object

The parser must **never call external APIs**.

---

# Parser Entry Function

Primary function:

```ts
parseMessage(message: string): ParsedSearch
```

Location:

```
/lib/parser/parseMessage.ts
```

Responsibilities:

* normalize input
* apply detection rules
* construct the final object

The function must not exceed **~100 lines**.

Complex logic must be delegated to rule helpers.

---

# Rules File

Location:

```
/lib/parser/rules.ts
```

This file contains **phrase detection rules**.

Examples:

```
price keywords
open status keywords
rating keywords
location patterns
```

Rules must be:

```
simple
readable
deterministic
```

Do not use machine learning or probabilistic logic.

---

# Message Normalization

Before parsing, the message must be normalized.

Steps:

```
lowercase text
remove punctuation
trim whitespace
collapse repeated spaces
```

Example:

Input:

```
"Find me a CHEAP sushi restaurant!!!"
```

Normalized:

```
find me a cheap sushi restaurant
```

Normalization must occur before applying rules.

---

# Supported Signals

The parser currently detects the following signals.

---

## Cuisine Detection

Extract restaurant type.

Examples:

```
sushi
pizza
ramen
burger
vegan
steak
thai
italian
korean
chinese
```

Implementation approach:

Simple keyword detection.

Example:

```
if message includes "sushi"
→ cuisine = "sushi"
```

Cuisine detection should be **case-insensitive**.

---

## Price Detection

Map natural language to price level.

| Phrase     | Price |
| ---------- | ----- |
| cheap      | 1     |
| budget     | 1     |
| affordable | 1     |
| moderate   | 2     |
| mid range  | 2     |
| expensive  | 3     |
| high end   | 4     |

Only the **first detected price signal** should be applied.

---

## Open Status

Detect if the user wants restaurants currently open.

Trigger phrases:

```
open now
currently open
open right now
```

Result:

```
openNow = true
```

If no phrase exists:

```
openNow remains undefined
```

---

## Rating Intent

Detect if the user wants highly rated restaurants.

Trigger phrases:

```
best
top rated
highly rated
strong reviews
```

Result:

```
sortBy = "rating"
```

Default sorting is:

```
relevance
```

---

## Location Detection

Location extraction is intentionally simple.

Supported patterns:

```
near <location>
in <location>
around <location>
downtown <location>
```

Examples:

```
near makati
in downtown los angeles
around tokyo
```

Extract the location phrase after the keyword.

Example:

```
near makati
→ locationText = "makati"
```

The parser must not attempt advanced geographic resolution.

---

# Conflict Handling

If multiple signals conflict:

Example:

```
cheap expensive sushi
```

Use the **first detected signal**.

Rule:

```
first match wins
```

This prevents unpredictable behavior.

---

# Output Object

The parser must return a fully structured object.

Example TypeScript type:

```ts
export type ParsedSearch = {
  rawMessage: string
  cuisine?: string
  locationText?: string
  openNow?: boolean
  sortBy?: "relevance" | "rating"
}
```

Fields must remain optional unless detected.

---

# Parser Limitations

The parser intentionally avoids complex NLP.

It does not support:

```
sentence segmentation
entity recognition
semantic analysis
context inference
```

The goal is **predictability and maintainability**.

---

# Testing Requirements

Parser behavior must be covered by tests.

Test file:

```text
/tests/parser/parseMessage.test.ts
```

Required test scenarios:

```
cheap sushi near los angeles
best ramen near tokyo
vegan restaurant in makati open now
pizza downtown manila
```

Tests must validate:

```
correct cuisine detection
correct price mapping
correct openNow detection
correct location extraction
```

Edge cases must also be tested.

Example:

```
empty message
message without restaurant keywords
message with conflicting signals
```

---

# Future Extensions

Possible future enhancements:

```
LLM fallback parsing
expanded cuisine dictionary
better location parsing
entity extraction
language detection
```

These improvements must **not break existing parser behavior**.

---

# Golden Rule

The parser must always be:

```
predictable
testable
easy to read
easy to modify
```

Avoid complex heuristics unless strictly necessary.