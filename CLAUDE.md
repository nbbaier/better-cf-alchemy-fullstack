# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack template built on Cloudflare infrastructure featuring dual-database architecture (D1 + Durable Objects), modern auth (Better Auth), and type-safe API communication (oRPC). The architecture provides per-user data isolation through Durable Objects.

## Development Commands

### Build & Type Checking

-  `bun build` — Build all workspaces
-  `bun typecheck` — TypeScript checks across all apps
-  `bun check` — Run Biome format + lint
-  `bun check:unsafe` — Run Biome with unsafe auto-fixes

### Database Operations (run from root)

-  `bun db:push` — Push schema changes to D1 database
-  `bun db:migrate` — Run D1 migrations
-  `bun db:generate` — Generate Drizzle migration files for D1
-  `bun db:studio` — Open Drizzle Studio for D1 (dev stage)
-  `cd apps/server && bun do:generate` — Generate Durable Object migrations

### Deployment (Alchemy)

-  `bun a:dev` — Start all apps in development mode with Alchemy (uses `.env.dev` files)
-  `bun a:deploy` — Deploy to production with Alchemy (uses `.env.prod` files)
-  `bun a:destroy` — Destroy production deployment
-  `bun a:dev:destroy` — Destroy development deployment
-  `bun a:clean` — Remove all `.alchemy` directories

### Individual App Development

-  `bun dev:web` — Start web app only (runs on port 3001)
-  `bun dev:server` — Start server only (runs on port 3000)
-  `bun vite:dev` — Run both apps with Turbo (without Alchemy)

**IMPORTANT:** Do NOT start the dev server unless explicitly requested. Database operations and code changes do not require running servers.

## Architecture & Key Concepts

### Dual-Database Architecture

This project uses **two separate databases** with different purposes:

1. **D1 (Central Database)** — `apps/server/src/infra/db/`

   -  **Purpose:** Shared/global data (authentication)
   -  **Schema:** `apps/server/src/infra/db/schema/` (auth.ts)
   -  **Migrations:** `apps/server/src/infra/db/migrations/`
   -  **Config:** `drizzle.db.config.ts`
   -  **Accessed via:** `db` from `apps/server/src/infra/db/index.ts`

2. **Durable Object SQLite (Per-User Database)** — `apps/server/src/infra/do/`
   -  **Purpose:** User-specific data (items, user content)
   -  **Schema:** `apps/server/src/infra/do/schema/chat.ts`
   -  **Migrations:** `apps/server/src/infra/do/migrations/`
   -  **Config:** `drizzle.do.config.ts`
   -  **Accessed via:** Durable Object instance in `user-durable-object.ts`
   -  **Key Classes:**
      -  `UserDurableObject` — Main DO class with per-user SQLite storage
      -  Each user gets their own isolated DO instance and database

### Per-User Durable Objects

-  Each user's data lives in their own Durable Object instance with its own SQLite database
-  User is identified via `getUserDOStub()` in `apps/server/src/infra/do/user-do-helper.ts`
-  All user operations go through the DO
-  DO migrations run automatically on first access per instance

### Authentication & Sessions

-  **Better Auth** for authentication (`apps/server/src/infra/auth.ts`)
-  Email/password with OTP plugin (OTPs log to console in all stages)
-  Sessions stored in Cloudflare KV (`SESSION_KV` binding)
-  Auth routes: `/api/auth/*`

### API & Routing Structure

-  **Server entry:** `apps/server/src/index.ts`
-  **oRPC Routers:** `apps/server/src/api/orpc/` — Type-safe API endpoints
   -  `items-router.ts` — Example CRUD operations
   -  `profile-router.ts` — User profile management
-  **Repository Pattern:** `apps/server/src/repositories/`
   -  `do/` — Durable Object repositories
   -  `d1/` — D1 database repositories (currently unused in template)
-  **Service Layer:** `apps/server/src/services/`
   -  Business logic and orchestration
   -  Example: `items/item-service.ts`

### Frontend Structure

-  **React 19** with TanStack Router (`apps/web/`)
-  **File-based routing:** Route files in `apps/web/src/routes/`
-  **Example CRUD:** `apps/web/src/routes/items/`
   -  `route.tsx` — Layout
   -  `index.tsx` — List view with create/delete
   -  `$itemId.tsx` — Edit view
-  **Components:** `apps/web/src/components/`
   -  `items/` — Example CRUD components
   -  `ui/` — shadcn/ui components
-  **State Management:** TanStack Query with oRPC hooks

## Environment Configuration

### Multi-Stage Setup (Alchemy)

-  **Stage variable:** `ALCHEMY_STAGE` (defaults to `dev`)
-  **Dev:** Uses `.env.dev`, `apps/web/.env.dev`, `apps/server/.env.dev`
-  **Prod:** Uses `.env.prod`, `apps/web/.env.prod`, `apps/server/.env.prod`
-  **Config file:** `alchemy.run.ts` loads stage-specific env files

### Required Environment Variables

See `.env.example` files in root and app directories. Key variables:

-  Auth: `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `CORS_ORIGIN`

## Code Style & Conventions

-  **TypeScript** with tab indentation, double quotes (Biome-enforced)
-  **Naming:**
   -  `camelCase` for variables/functions
   -  `PascalCase` for React components/types
   -  `kebab-case` for filenames
-  **Exports:** Prefer named exports; default exports only for pages/routes
-  **Components:** Co-locate by feature; server-only code stays in `apps/server/`
-  **Database:**
   -  D1 schema changes: edit schema → `bun db:generate` → `bun db:migrate`
   -  DO schema changes: edit schema → `cd apps/server && bun do:generate` → migrations run automatically on DO access

## Example: Adding a New Feature

1. **Define domain model:** `apps/server/src/domain/your-feature.ts`
2. **Create DO schema:** Update `apps/server/src/infra/do/schema/chat.ts`
3. **Generate migrations:** `cd apps/server && bun do:generate`
4. **Create repository:** `apps/server/src/repositories/do/your-feature-repository.ts`
5. **Create service:** `apps/server/src/services/your-feature/service.ts`
6. **Create oRPC router:** `apps/server/src/api/orpc/your-feature-router.ts`
7. **Update DO:** Add methods to `user-durable-object.ts`
8. **Create UI routes:** `apps/web/src/routes/your-feature/`
9. **Create components:** `apps/web/src/components/your-feature/`

## Testing & Quality

-  Type-safety and integration testing prioritized over unit tests
-  **Minimum requirements:**
   -  `bun typecheck` must pass
   -  `bun check` must pass

## Security Notes

-  Do not commit secrets; use stage-specific env files
-  Cloudflare Workers bindings configured in `alchemy.run.ts`:
   -  `DB` (D1), `SESSION_KV` (KV), `USER_DO` (Durable Object Namespace)

## Key Files Reference

-  **Alchemy config:** `alchemy.run.ts`
-  **Server index:** `apps/server/src/index.ts`
-  **Auth setup:** `apps/server/src/infra/auth.ts`
-  **DO class:** `apps/server/src/infra/do/user-durable-object.ts`
-  **DO helper:** `apps/server/src/infra/do/user-do-helper.ts`
-  **Web router:** `apps/web/src/routes/`
-  **D1 schema:** `apps/server/src/infra/db/schema/`
-  **DO schema:** `apps/server/src/infra/do/schema/chat.ts`
