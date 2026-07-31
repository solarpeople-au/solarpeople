# The Solar People

Next.js website for The Solar People, a Melbourne residential and commercial
solar and battery installer.

## Pages

- Home
- Residential Solar
- Commercial Solar
- Our Work
- About
- Free Quote

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local`.
3. Add the Solar People Supabase project values.
4. Run `pnpm dev`.

The quote form stores enquiries in Supabase through a server-only API route.
Database tables and security policies are defined in `supabase/migrations`.
