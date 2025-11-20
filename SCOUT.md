# Codebase Scout Report

**Last Updated:** November 19, 2025

## High-Level Overview

This is a full-stack monorepo project named `better-chat`, adapted from a template. It is built on **Cloudflare infrastructure** and features a **Dual-Database Architecture** (D1 for global data, Durable Objects for per-user isolation).

The project is structured as a monorepo with two main applications:
- `apps/server`: The backend API running on Cloudflare Workers
- `apps/web`: The frontend application built with React 19

## Key Technologies

### Infrastructure & Deployment
- **Runtime:** Cloudflare Workers (Edge-native serverless)
- **Orchestration:** Alchemy (`bun a:dev`, `bun a:deploy`)
- **Databases:**
    - **Cloudflare D1 (SQLite):** Shared/Global data (mainly authentication)
    - **Cloudflare Durable Objects (SQLite):** Per-user isolated storage
- **Package Manager:** `bun`
- **Monorepo Tool:** `turbo`

### Backend (`apps/server`)
- **Framework:** Hono (HTTP routing)
- **API Layer:** oRPC (Type-safe RPC)
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth (Email/password, OTP)
- **State:** Durable Objects (for user-specific state)

### Frontend (`apps/web`)
- **Framework:** React 19
- **Routing:** TanStack Router (File-based routing)
- **Data Fetching:** TanStack Query
- **API Client:** oRPC Client
- **Styling:** Tailwind CSS 4
- **UI Library:** shadcn/ui

## Architecture Flow

1. **Authentication Flow:** User signs in → Better Auth (D1) → Session stored in KV → Protected routes
2. **Data Flow:** Frontend (React) → oRPC Client → API Router → Service Layer → Repository → Durable Object (per-user SQLite)
3. **Per-User Isolation:** Each user gets their own Durable Object instance with dedicated SQLite database

## Project Structure

### `apps/server`
- `src/api`: HTTP and oRPC route definitions
- `src/domain`: Business entities and types
- `src/infra`: Infrastructure setup (DB schemas, auth config, Durable Objects)
    - `src/infra/db`: D1 schema and migrations (auth tables)
    - `src/infra/do`: Durable Object schema and implementation (user-specific data)
- `src/repositories`: Data access layer
- `src/services`: Business logic
- `src/lib`: Utilities, middleware, context

### `apps/web`
- `src/routes`: Application pages and routing logic (TanStack Router)
- `src/components`: Reusable UI components (shadcn/ui)
    - `items/`: Item CRUD components
    - `navigation/`: Header, user menu, etc.
    - `ui/`: Base UI components
- `src/lib`: Utilities, API clients, auth context
- `src/hooks`: Custom React hooks

## Current Implementation

The project includes a complete **Items CRUD example** that demonstrates:
- **Domain modeling** (`apps/server/src/domain/items.ts`)
- **Repository pattern** (`apps/server/src/repositories/do/item-repository.ts`)
- **Service layer** (`apps/server/src/services/items/item-service.ts`)
- **oRPC API** (`apps/server/src/api/orpc/items-router.ts`)
- **Durable Object storage** (`apps/server/src/infra/do/user-durable-object.ts`)
- **Frontend UI** (`apps/web/src/routes/items/`)

**Authentication features:**
- Sign-in/sign-up with email/password
- Session management
- Protected routes
- User settings (profile, appearance)

## Quick Start Commands

```bash
# Install dependencies
bun install

# Start full development environment
bun a:dev

# Database management
bun db:migrate          # D1 migrations
bun db:studio          # Open Drizzle Studio
cd apps/server && bun do:generate  # DO migrations

# Code quality
bun check              # Lint/format
bun typecheck          # TypeScript check
```

## First Tasks When Resuming

1. **Environment Setup:** Ensure `.env.dev` exists with required variables
2. **Database State:** Run `bun db:migrate` and `cd apps/server && bun do:generate`
3. **Start Development:** Run `bun a:dev` to verify everything works
4. **Explore the Items Example:** 
   - Backend: `apps/server/src/api/orpc/items-router.ts`
   - Frontend: `apps/web/src/routes/items/index.tsx`
5. **Add New Features:** Follow the established pattern (Domain → Repository → Service → API → UI)

## Key Patterns

- **Type Safety:** Full end-to-end type safety via oRPC
- **Per-User Data:** All user-specific data goes through Durable Objects
- **Protected Routes:** Use `protectedProcedure` for authenticated endpoints
- **Error Handling:** Consistent error handling with toast notifications
- **File Naming:** kebab-case for files, camelCase for functions, PascalCase for components

## Deployment

Uses Alchemy for multi-stage deployment:
- **Development:** `bun a:dev` (local with `.env.dev`)
- **Production:** `bun a:deploy` (Cloudflare with `.env.prod`)
- **Cleanup:** `bun a:destroy` or `bun a:dev:destroy`