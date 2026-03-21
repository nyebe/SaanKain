# SaanKain 🍜

> **"Saan ba tayo kakain?"** — Filipino for *"Where should we eat?"*

SaanKain is a **natural-language restaurant discovery prototype** built by [Nyebe Creations](https://github.com/nyebe). Type a free-form query like:

```
cheap sushi near makati open now
```

The app interprets your message, searches places via the **Foursquare Places API**, ranks results by relevance, and presents them in a clean, mobile-first UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗣️ **Natural Language Search** | No forms or dropdowns — just type what you want |
| 🧠 **LLM + Rule Parser** | Groq LLM (`llama-3.1-8b-instruct`) extracts cuisine, location, and `openNow` status; rule-based regex is always available as a fallback |
| 📍 **Geolocation** | Browser Geolocation + OpenStreetMap Nominatim reverse-geocode powers "near me" searches |
| 🗺️ **Foursquare Places** | Live place data queried by text or lat/lng coordinates |
| 🎛️ **Filter, Sort & View** | Filter by category, sort by name / type / distance, switch between list and gallery views |
| 🔖 **Bookmarks & History** | Save favorite spots and revisit past searches anytime (stored in `localStorage`) |
| 🌙 **Dark Mode** | System-aware theme via `next-themes` |

---

## 🛠️ Technology Stack

### Framework
- **Next.js** (App Router, full-stack) · TypeScript · TailwindCSS

### UI
- [shadcn/ui](https://ui.shadcn.com/) · Framer Motion · Lucide React · Recharts · Sonner · Vaul · Embla Carousel

### HTTP / AI
- Axios · [groq-sdk](https://www.npmjs.com/package/groq-sdk)

### Integrations
- [Foursquare Places API](https://docs.foursquare.com/fsq-developers-places) · [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/)

### Testing
- Vitest · Testing Library

---

## 🔄 How It Works

```
1. 💬 You type    →  "cheap sushi near makati open now"
2. 🔍 LLM/Parser  →  Groq LLM (or rule-based fallback) extracts cuisine · location · openNow
3. 🧠 Geocoding   →  Browser Geolocation + Nominatim reverse-geocode → lat/lng
4. 📍 Places API  →  Foursquare Places API queried by text or coordinates
5. 🏆 Ranking     →  Cuisine match scored · distance used as tiebreaker
6. ✨ Results     →  Filter by category · sort · switch list or gallery view
```

---

## 🏗️ Architecture

```
UI (components / pages)
        ↓
Hooks (state & logic)
        ↓
Services (API communication)
        ↓
API route  /api/v1/execute
        ↓
lib/  (parser · foursquare · ranking · validation)
```

Pages follow a **4-file colocated structure**:

| File | Responsibility |
|---|---|
| `page.tsx` | Server component, metadata, renders Client |
| `<Page>Client.tsx` | Client-only UI (animations, interactions) |
| `use<Page>.ts` | State, loading, error management |
| `data<Page>.ts` | Data adapters / helpers calling services |

---

## 📋 Requirements

### Accounts & API Keys

You need accounts on the following services to run SaanKain:

1. **Foursquare** — [Create a free developer account](https://foursquare.com/developers/) and generate a **Places API key** (OAuth bearer token) from the Foursquare Developer Console.

2. **Groq** — [Create a free account](https://console.groq.com/) and generate an **API key** from the Groq console. Groq is used to power natural language parsing with `llama-3.1-8b-instruct`. If the key is absent, the app automatically falls back to the built-in regex parser — so this is optional but recommended.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Foursquare Places API
FOURSQUARE_API_KEY=
FOURSQUARE_API_BASE=https://places-api.foursquare.com
FOURSQUARE_RESULT_LIMIT=25
FOURSQUARE_FIELDS=fsq_place_id,name,location,categories,distance,date_closed

# API Gate
EXECUTE_API_CODE=pioneerdevai
MAX_MESSAGE_LENGTH=500

# Groq
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-8b-instruct
USE_LLM_PARSE=true
```

> **Never commit `.env.local` to source control.** It is already listed in `.gitignore`.

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn / bun)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nyebe/SaanKain.git
cd SaanKain

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env .env
# Edit .env and fill in your API keys

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run unit tests (Vitest) |

---

## 🌐 Deploy on Vercel

SaanKain is designed to be deployed on [Vercel](https://vercel.com).

### One-click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nyebe/SaanKain)

### Manual Deployment

1. Push your code to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Add the following **Environment Variables** in the Vercel project settings:

   | Variable | Required | Description |
   |---|---|---|
   | `FOURSQUARE_API_KEY` | ✅ | Foursquare Places API bearer token |
   | `FOURSQUARE_API_BASE` | ✅ | `https://api.foursquare.com/v3` |
   | `GROQ_API_KEY` | ⬜ | Groq LLM API key (optional, enables smarter parsing) |
   | `NEXT_PUBLIC_API_CODE` | ✅ | API access code (`pioneerdevai`) |

4. Click **Deploy**. Vercel will automatically build and publish the app.

The live demo is available at **[https://saan-kain.vercel.app](https://saan-kain.vercel.app)**.

---

## 🧪 Testing

```bash
# Unit tests (parser, ranking, validation)
npm test

# Watch mode
npm run test:watch

```

Test files live under `tests/`:

```
tests/
├── parser/
│   └── parseMessage.test.ts
├── ranking/
│   └── rankResults.test.ts
├── foursquare/
│   └── transform.test.ts
└── api/
    └── v1/execute.test.ts
```

---

## 🗂️ Project Structure

```
SaanKain/
├── app/
│   ├── (landing)/        # Home page (search entry)
│   ├── about/            # About page
│   ├── results/          # Results page
│   └── api/v1/execute/   # REST API endpoint
├── components/           # Shared UI components
├── hooks/                # Shared reusable hooks
├── lib/
│   ├── foursquare/       # Foursquare API client + transform
│   ├── parser/           # NL parser (LLM + regex rules)
│   ├── ranking/          # Result ranking logic
│   └── validation/       # Input validation
├── providers/            # React context providers (theme, etc.)
├── services/             # HTTP service layer (calls API routes)
├── tests/                # Unit & integration tests
└── types/                # Shared TypeScript types
```

---

## ⚙️ Engineering Practices

- 🔒 **TypeScript Strict Mode** — `strict: true` in `tsconfig.json`; no `any`
- 🏗️ **Layered Architecture** — `lib/` → `services/` → `hooks/` → `components/`
- 🛡️ **API Input Validation** — auth code, message length, and coordinate range validated before any logic runs
- 🧠 **LLM Output Guarded by Zod** — Groq response validated with a Zod schema; regex fallback always available
- 🧪 **Unit Tests** — parser and validation modules covered with Vitest
- 💾 **Safe localStorage** — SSR guard + try/catch on all reads/writes; history capped at 50, bookmarks at 20
- 🌐 **SEO Metadata** — Next.js metadata API with title, description, OpenGraph, and keywords
- 📲 **Functional Decomposition** — Breaking down complex functions into smaller, more manageable pieces.
- 🗃️ **4-File Structure Page** — Organizing page components into four distinct files for better maintainability.
- 📦 **Single Responsibility Principle** — Each function or class should have only one reason to change.
- 🍱 **Separation of Concerns** — Dividing a program into distinct sections where each section addresses a separate concern.
- 🔠 **Naming Conventions** — Using descriptive and consistent names for variables, functions, and classes.

---

## 👤 Developer

**Ian Cedric Ramirez** — Full Stack Engineer · 3 years experience

Building playful, practical projects. When not coding, exploring mountains, beaches, and reading books.

- [LinkedIn](https://www.linkedin.com/in/ian-cedric-ramirez)
- [GitHub](https://github.com/ian-cedric-ramirez)

Built by **[Ian](https://github.com/nyebe)**.

---

## 📄 License

This project is a **demo / prototype** and is not intended for production use.

