# Siteclaud

Siteclaud is a production-shaped SaaS platform for converting webpages into clean, AI-ready Markdown. It includes a premium marketing site, working converter tool, auth routes, dashboard, conversion history, API key endpoint, Prisma/PostgreSQL schema, rate limiting, dark mode, and responsive UI.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS v4
- shadcn/ui, Framer Motion, Lucide React
- React Query and Zustand
- Prisma ORM with PostgreSQL
- Puppeteer, Cheerio, Readability.js, Turndown
- Cookie-based auth scaffold with bcrypt password hashing

## Routes

- `/` homepage
- `/tools`
- `/tools/convert-webpage-to-markdown`
- `/tools/convert-notion-to-markdown`
- `/tools/convert-html-to-markdown`
- `/tools/convert-pdf-to-markdown`
- `/tools/convert-docx-to-markdown`
- `/pricing`
- `/features`
- `/blog`
- `/login`
- `/signup`
- `/dashboard`
- `/dashboard/history`
- `/dashboard/api`
- `/dashboard/settings`

## API

- `POST /api/convert`
- `POST /api/convert-notion`
- `POST /api/convert-html`
- `POST /api/convert-pdf`
- `POST /api/convert-docx`
- `GET /api/history`
- `DELETE /api/conversion/:id`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/api-keys/create`

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Set `DATABASE_URL` to a Supabase, Railway, Neon, or local PostgreSQL database. The converter API can run without a database, but saving history, auth, and API keys need PostgreSQL.

## Verification

```bash
npm run lint
npm run build
```

Both pass in this workspace.

## Deployment

Deploy to Vercel with the same environment variables from `.env.example`. Use Supabase or Railway for PostgreSQL. Puppeteer may need Vercel-compatible Chromium packaging for heavy production workloads; the current implementation includes a fetch fallback for environments where browser launch fails.
