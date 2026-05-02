# FortuneCrack

> Crack a cookie, read your fortune. Save it. Share it.

**Live:** https://crack-cookie.vercel.app

A small web app where users crack virtual fortune cookies, save the ones that resonate, and share them via custom Open Graph cards.

## What it does

- Email + password auth (Supabase)
- Crack flow: animated cookie → fortune reveal → save to personal collection
- Personal account page with saved fortunes
- Shareable URLs with auto-generated OG images and Instagram-story-format renders
- Mobile-first UI, custom design tokens

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **Supabase** — auth + Postgres
- **Tailwind v4** + **shadcn/ui** on base-ui primitives
- **Vercel** — continuous deploy from `main`
- **pnpm** workspace

## Run locally

```bash
pnpm install
pnpm dev
```

Requires `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Notes

Built as a vibe coding exercise — small product, end-to-end, shipped to production. Auth, DB, share flows, OG image generation, and styling all in one short build cycle.
