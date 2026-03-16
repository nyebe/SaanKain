# Pages Instructions — SaanKain

This document defines how **page-level code must be structured**.

All page implementations must follow the **three-layer page architecture**:

```
data
logic
ui
```

This separation prevents business logic from leaking into the UI.

---

# Page Architecture

Every page must follow this structure:

```
/app/page.tsx        → UI layer
/hooks/useSearch.ts  → Logic layer
/services/search.ts  → Data layer
```

Responsibilities are strictly separated.

---

# Layer Overview

```
UI Layer
↓
Logic Layer
↓
Data Layer
↓
API
```

Each layer has a specific responsibility.

---

# UI Layer

Location example:

```
/app/page.tsx
```

Responsibilities:

```
render components
display state
handle user interaction
```

Allowed actions:

```
call hooks
pass props
trigger events
render results
```

UI must not:

```
call APIs directly
contain business logic
parse messages
rank results
```

UI must remain **pure presentation logic**.

---

# Logic Layer

Location example:

```
/hooks/useSearch.ts
```

Responsibilities:

```
state management
loading states
error states
invoking services
data transformation for UI
```

Example responsibilities:

```
track loading
handle API errors
store search results
trigger search
```

Logic must not:

```
render UI
call external APIs directly
parse natural language
```

Logic may call **services**.

---

# Data Layer

Location example:

```
/services/search.ts
```

Responsibilities:

```
API communication
request construction
response parsing
error mapping
```

This layer communicates with:

```
/api/execute
```

Data layer must not:

```
contain UI logic
contain component state
perform ranking
perform parsing
```

Those belong to backend modules.

---

# Example File Layout

Recommended structure:

```
/app
  page.tsx

/hooks
  useSearch.ts

/services
  search.ts
```

This keeps each layer small and predictable.

---

# Example Flow

User action:

```
User enters message
↓
UI calls hook
↓
Hook triggers service
↓
Service calls API
↓
API processes search
↓
Hook updates state
↓
UI renders results
```

---

# Example Responsibilities

### page.tsx

Responsible for:

```
rendering SearchForm
rendering ResultsList
displaying loading state
displaying errors
```

---

### useSearch.ts

Responsible for:

```
search state
loading state
error state
calling search service
```

Example state:

```
results
loading
error
parsed query
```

---

### search.ts

Responsible for:

```
calling /api/execute
passing message parameter
returning normalized response
handling network errors
```

---

# Import Rules

UI layer may import:

```
@/hooks
@/components
@/types
```

Logic layer may import:

```
@/services
@/types
```

Data layer may import:

```
@/types
```

Data layer must not import UI or hooks.

---

# State Ownership

State should exist only in the **logic layer**.

Examples:

```
results
loading
error
parsed search
```

UI should receive these via props or hooks.

---

# Error Handling

Errors should be handled in the **logic layer**.

UI should only display:

```
error message
fallback state
```

---

# Loading State

Loading must be controlled by the **logic layer**.

UI simply renders loading indicators.

Example components:

```
LoadingState
ErrorState
ResultsList
```

---

# Testing Scope

Tests should target the logic layer.

Example:

```
/tests/hooks/useSearch.test.ts
```

Possible test cases:

```
loading state triggers correctly
API success returns results
API failure sets error state
empty results handled
```

UI testing is optional.

---

# Page Size Rule

If a page grows beyond:

```
150 lines
```

refactor responsibilities into:

```
hooks
components
services
```

---

# Golden Rule

Page files must remain:

```
small
readable
UI focused
```

If a page contains business logic, the architecture has been violated.

---

## Recommendation (important)

For **Copilot control**, your final instruction stack should now look like:

```
instructions/
 ├ parser.instructions.md
 ├ foursquare.instructions.md
 ├ api.instructions.md
 ├ ranking.instructions.md
 ├ pages.instructions.md
```

These five files give Copilot **almost complete architectural guidance**.
