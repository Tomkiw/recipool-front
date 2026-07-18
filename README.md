# Tasteorama 🍳

A recipe-sharing web application where users can discover, search, filter, save,
and publish their own recipes.

## About the project

Tasteorama solves the everyday problem of finding and organizing cooking recipes.
Visitors can browse and search a shared recipe collection, filter it by category
and ingredient, and open any recipe for a detailed view. Registered users get a
personal profile with their **own** and **favorite** recipes, and can publish new
recipes with a photo, ingredients, cooking time, calories and step‑by‑step
instructions.

### Key features

- **Public catalog** (`/`) — search box, category/ingredient filters, recipe grid
  with "Load more" pagination.
- **Recipe details** (`/recipes/[recipeId]`) — full recipe with ingredients,
  instructions and a favorite toggle.
- **Add recipe** (`/add-recipe`) — a validated form with image preview
  (auth‑only).
- **Profile** (`/profile/[recipeType]`) — `own` and `favorites` tabs (auth‑only).
- **Auth** — registration (`/auth/register`) and login (`/auth/login`).
- Global `error.tsx` / `not-found.tsx`, per‑page loaders, toast notifications and
  responsive **mobile‑first** layout (320px → 393px → 768px → 1440px).

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **CSS Modules** + **modern-normalize**
- **TanStack Query** (React Query) — server state, caching
- **Zustand** — client state (auth, filters)
- **Formik** + **Yup** — forms and validation
- **Axios** — HTTP client
- **iziToast** — toast notifications
- **next/image** — optimized images

## Getting started

### Prerequisites

- Node.js 18.18+ (or 20+)
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
# Public URL of this Next.js app (used by the client axios instance)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Absolute URL of the backend API the route handlers proxy to.
# Required for data fetching to work — set it to your deployed backend.
NEXT_PUBLIC_BACKEND_API_URL=
NEXT_BACKEND_API_URL=

# Optional: canonical site URL used for metadata / Open Graph
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ `NEXT_PUBLIC_BACKEND_API_URL` / `NEXT_BACKEND_API_URL` must point to a
> running backend. While empty, recipe requests return empty results.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
npm run start
```

### 5. Lint

```bash
npm run lint
```

## Project structure

```
app/                    # App Router routes
  (public routes)/      # / and /recipes/[recipeId]
  (private routes)/     # /add-recipe, /profile/[recipeType] (auth-guarded layout)
  (auth routes)/        # /auth/login, /auth/register
  api/                  # Route handlers that proxy to the backend
  error.tsx             # Global error boundary
  not-found.tsx         # Global 404 page
components/             # UI components (CSS Modules)
hooks/                  # React Query hooks
lib/api/                # API layer (client + server)
lib/store/              # Zustand stores
lib/validation/         # Yup schemas
types/                  # Shared TypeScript types
```

## Routing

- Public pages are accessible to everyone.
- Private pages (`/add-recipe`, `/profile/*`) are protected on two levels:
  - `proxy.ts` (Next.js 16 proxy — the successor of `middleware.ts`) refreshes the
    session from cookies, redirects unauthenticated users to `/auth/login`, and
    redirects already authenticated users away from the auth pages;
  - the `(private routes)` server layout re-verifies the session at the component
    level and redirects to `/auth/login` if it is invalid.
