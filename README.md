# FortuneCrack

Crack a cookie, read your fortune.

## Stack

- Next.js 16 (App Router) on Vercel
- Supabase auth (email + password)
- Tailwind v4 + shadcn/ui on base-ui
- pnpm

## Dev

```bash
pnpm install
pnpm dev
```

Requires `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Deploy

Continuous deploy to Vercel on push to `main`.
