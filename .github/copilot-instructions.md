# SaanKain — Copilot Instructions

## Role

You are an AI coding assistant working on **SaanKain**, a natural-language restaurant discovery system built by **Nyebe Creations**.

Your responsibility is to generate **code, documentation, and tests** that strictly follow the repository architecture and engineering rules.

The system allows users to enter natural language such as:

```
cheap sushi near makati open now
```

The system will:

1. Parse the message into structured search parameters
2. Query the Foursquare Places API
3. Rank results based on user intent
4. Return structured restaurant results
5. Display results in a simple UI

---

# AI Workflow

Always follow this sequence:

1. Receive the task, issue, or request.
2. Analyze context and relevant architecture documents.
3. Ask clarification **only once if necessary**.
4. Generate code following repository rules.
5. Validate the output using:

```
npm run type-check
npm run build
```

Never produce code that fails either command.

---

# Critical Rules

## TypeScript Safety

Never use:

```
any
```

If a type cannot be defined immediately:

```ts
// TODO: define type
```

Use types defined in:

```
/types
```

Never invent duplicate types.

Do not declare interfaces or types inside component files (under `/components`) except for the primitive UI internals in `/components/ui` which may define narrow, presentation-focused types.
Do not declare interfaces or types inside page files (`/app`) or API route files (`/app/api` or `/pages/api`). All shared types and interfaces must live under `/types` and be imported via root imports (e.g., `@/types/search`).

---

## Architecture Boundaries

The repository enforces **strict separation of concerns**.

Architecture layers:

```
UI
↓
Hooks (logic)
↓
Services (data)
↓
API
↓
Business modules
```

Violating these layers is not allowed.

---

# Core Stack

SaanKain uses:

```
Next.js (App Router)
React
TypeScript
TailwindCSS
Node.js
```

Backend modules are written in **pure TypeScript**.

---

# Important Directories

```
/app
/components
/hooks
/services
/lib
/types
/tests
/instructions
/docs
```

Each directory has strict ownership rules.

---

# App Directory

Location:

```
/app
```

Contains:

```
page.tsx
layout.tsx
/api/v1/execute/route.ts
```

Rules:

```
No business logic in /app
```

API routes orchestrate modules only.

---

# Page File Structure

Every page under `/app` must follow a strict 3-file structure colocated in the page folder:

- `page.tsx` — UI-only React component (no business logic or types/interfaces)
- `use<PageName>.ts` — client or server hook containing page-specific state and logic
- `data<PageName>.ts` — data helpers / adapters for the page (calls services, transforms data)

Files must live together in the same folder for the page (e.g. `app/(landing)/page.tsx`, `app/(landing)/useLanding.ts`, `app/(landing)/dataLanding.ts`).

Keep `page.tsx` focused on rendering and delegating to the hook; do not place business logic, parsing, or types inside `page.tsx`.

If a page needs shared types, import them from `/types` (do not declare types or interfaces inside `page.tsx`, `use*` files may reference shared types but should not declare new exported interfaces that belong in `/types`).


---

# Components

Location:

```
/components
```

Responsibilities:

```
UI rendering
display state
layout
user interaction
```

Components must not:

```
call APIs
parse text
rank results
implement business logic
```

---

# Hooks (Logic Layer)

Location:

```
/hooks
```

Example:

```
useSearch.ts
```

Responsibilities:

```
search state
loading state
error state
trigger search
store results
```

Hooks may call **services**, but not backend modules.

Notes:
- The `/hooks` directory is reserved for reusable, shared hooks only (e.g., `useIsMobile`, `useAuth`).
- Page-specific hooks must be colocated with the page using the 4-file structure (`use<PageName>.ts` inside the page folder under `/app`).
  - page.tsx (UI) - SSR or CSR React component
  - use<PageName>.ts - page-specific hook for state and logic
  - data<PageName>.ts - page-specific data helpers that call services and static data
  - <PageName>Client.ts - client-only module for client-specific logic (e.g., localStorage, window events)
- Do not place page-specific logic or types in `/hooks` — keep those in the page folder.

---

# Services (Data Layer)

Location:

```
/services
```

Example:

```
search.ts
```

Responsibilities:

```
call /api/v1/execute
handle network requests
parse API responses
return typed results
```

Services must not contain UI logic.

---

# Business Logic Modules

Location:

```
/lib
```

Contains core backend modules:

```
parser
foursquare
ranking
validation
utils
```

---

# Parser Module

Location:

```
/lib/parser
```

Purpose:

Convert natural language into structured parameters.

Example:

```
cheap sushi near makati open now
```

Parsed result:

```
{
  cuisine: "sushi",
  locationText: "makati",
  openNow: true
}
```

Parser must be deterministic and testable.

---

# Foursquare Module

Location:

```
/lib/foursquare
```

Responsibilities:

```
build API requests
authenticate with Foursquare
retrieve place data
normalize results
```

External API payloads must be transformed into internal types.

---

# Ranking Module

Location:

```
/lib/ranking
```

Purpose:

Sort restaurants based on user intent.

Ranking signals:

```
cuisine match
price match
open status
rating preference
distance
```

Ranking must be deterministic.

---

# Validation Module

Location:

```
/lib/validation
```

Responsibilities:

```
validate request parameters
verify API code gate
sanitize input
```

Validation must occur before parsing.

---

# API Endpoint

Required endpoint:

```
GET /api/v1/execute
```

Example:

```
// example
/api/v1/execute?message=cheap sushi near makati open now&code=pioneerdevai
```

Flow:

```
validate request
parse message
query Foursquare
rank results
return JSON response
```

---

# Multi-Stage Processing Flow

The system follows this pipeline:

```
User Message
↓
Validation
↓
Parser
↓
Foursquare Search
↓
Transform Results
↓
Ranking
↓
API Response
```

Each stage must be independent.

---

# Import Rules

Always use root imports:

```
@/lib
@/types
@/components
```

Always import shared types and interfaces from `@/types` (do not declare types inline in components, pages, or API routes).

Avoid deep relative imports.

Incorrect:

```
../../lib/parser
```

---

# Protected Files

These files define architecture rules:

```
/instructions/*
/docs/*
```

Do not modify them unless explicitly instructed.

---

# Tests

Location:

```
/tests
```

Tests must exist for:

```
parser
ranking
API validation
Foursquare result normalization
```

External APIs must be mocked.

---

# Developer Commands

Install dependencies:

```
npm install
```

Type check:

```
npm run type-check
```

Build project:

```
npm run build
```

Run tests:

```
npm run test
```

---

# Sub-Instruction Files

Detailed architecture rules exist in:

```
/instructions/parser.instructions.md
/instructions/foursquare.instructions.md
/instructions/api.instructions.md
/instructions/ranking.instructions.md
/instructions/pages.instructions.md
/instructions/types.instructions.md
```

If one of these files does not exist, ask for it before generating code.

---

# Development Priority

The system prioritizes:

```
correct architecture
readability
type safety
predictable behavior
maintainability
```

Optimization and advanced features come later.

---

# Naming Conventions

Follow clear, descriptive naming across the codebase to improve readability and maintainability. Enforce these rules in code reviews and linters.

- **Descriptive names:** Prefer domain-specific, descriptive names for variables, functions, types, files, and modules (e.g., `searchQuery`, `fetchResults`, `SearchResult`, `landing.data.ts`).
- **Avoid short/ambiguous names:** Do **not** use single-letter or 1–3 character names (e.g., `e`, `i`, `x`) except for simple loop indices in tiny, local scopes. Avoid generic names like `data`, `file`, `unit`, or `item` that reveal no intent.
- **No cryptic acronyms:** Avoid unclear acronyms (e.g., `svc`, `usr`, `cfg`) unless the acronym is widely known in the project domain and documented.
- **Event handler parameters:** Do not use `e` for event parameters. Use `event`, `evt`, or a domain-specific name like `formEvent` or `clickEvent` to show intent.
- **Functions:** Use verb-based names for actions (e.g., `validateInput`, `loadSearchResults`).
- **Types / Interfaces:** Use `PascalCase` and expressive names for types and interfaces (e.g., `SearchResult`, `LandingPageState`).
- **Files:** Use descriptive filenames; avoid ambiguous names like `utils.ts` or `data.ts`. Prefer `search.service.ts`, `landing.data.ts`, or `resultsCard.tsx`.

If you want, I can add an ESLint rule set and examples to enforce several of these conventions automatically.

---

# Golden Rule

If the correct location for a feature is unclear:

```
Stop and ask before implementing.
```

Never invent new architecture.