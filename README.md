# elev8

A community-driven content platform prototype. Built to explore new models for how people share ideas, have conversations, and recognize quality contributions.

**Status:** Early prototype — actively in development.

---

## Quickstart

**Prerequisites:** Node.js 18+ and [pnpm](https://pnpm.io/)

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

The app runs in **mock mode** by default — no external services required. To connect a live database, copy the example env file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

---

## Project Structure

```
app/                → Pages and UI (Next.js App Router — folder structure defines routes)
  (auth)/           → Authentication pages (login, signup)
  (main)/           → Core app pages (explore, communities, threads, profiles)
  components/       → Shared UI components

lib/                → Utilities, types, and data layer

proxy.ts            → Route-level access control
```

---

## Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS 4
- **Database & Auth:** Supabase
- **Deployment:** Vercel
