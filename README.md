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
- `/tools/convert-google-docs-to-markdown`
- `/tools/convert-html-to-markdown`
- `/tools/convert-xml-to-markdown`
- `/tools/convert-json-to-markdown`
- `/tools/convert-csv-to-markdown`
- `/tools/convert-rtf-to-markdown`
- `/tools/convert-paste-to-markdown`
- `/tools/ai-reply-generator`
- `/tools/ai-prompt-generator`
- `/tools/ai-prompt-optimizer`
- `/tools/ai-faq-generator`
- `/tools/ai-answer-generator`
- `/tools/ai-email-response-generator`
- `/tools/ai-letter-generator`
- `/tools/ai-blog-title-generator`
- `/tools/ai-chatbot-name-generator`
- `/tools/ai-saas-brand-name-generator`
- `/tools/ai-chat-with-your-text-data`
- `/tools/ai-chat-with-your-website-data`
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
- `POST /api/convert-google-docs`
- `POST /api/convert-html`
- `POST /api/convert-xml`
- `POST /api/convert-json`
- `POST /api/convert-csv`
- `POST /api/convert-rtf`
- `POST /api/convert-paste`
- `POST /api/ai-reply-generator`
- `POST /api/ai-prompt-generator`
- `POST /api/ai-prompt-optimizer`
- `POST /api/ai-faq-generator`
- `POST /api/ai-answer-generator`
- `POST /api/ai-email-response-generator`
- `POST /api/ai-letter-generator`
- `POST /api/ai-blog-title-generator`
- `POST /api/ai-chatbot-name-generator`
- `POST /api/ai-saas-brand-name-generator`
- `POST /api/ai-chat-text-data`
- `POST /api/ai-chat-website-data`
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
