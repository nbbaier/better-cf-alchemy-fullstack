# Cloudflare Full-Stack Template

A production-ready full-stack template built on Cloudflare infrastructure with dual-database architecture, authentication, and modern development tools.

## Features

### Architecture

-  **Dual-Database Design**:
   -  **D1 (SQLite)**: Shared/global data (authentication)
   -  **Durable Objects SQLite**: Per-user isolated storage (user-specific data)
-  **Per-User Isolation**: Each user gets their own Durable Object instance with dedicated SQLite database
-  **Cloudflare Workers**: Edge-native serverless runtime
-  **Better Auth**: Email/password authentication with OTP (console logging for development)
-  **KV Sessions**: Distributed session storage with rate limiting

### Tech Stack

#### Frontend

-  **React 19** with modern patterns
-  **TanStack Router** for file-based routing
-  **TanStack Query** for data fetching and caching
-  **oRPC** for type-safe API calls
-  **Tailwind CSS 4** for styling
-  **shadcn/ui** for UI components

#### Backend

-  **Cloudflare Workers** for serverless compute
-  **Hono** for HTTP routing
-  **oRPC** for type-safe RPC
-  **Drizzle ORM** for database operations
-  **Better Auth** for authentication

#### Infrastructure

-  **Cloudflare D1**: Central SQLite database
-  **Cloudflare Durable Objects**: Per-user stateful storage
-  **Cloudflare KV**: Session and cache storage
-  **Alchemy**: Multi-stage deployment and orchestration

## Development

### Quick Start

```bash
# Install dependencies
bun install

# Start development environment (uses .env.dev)
bun a:dev

# Individual apps
bun dev:web     # Web app only (port 3001)
bun dev:server  # Server only (port 3000)
```

### Database Management

```bash
# D1 (Central Database)
bun db:generate  # Generate migrations
bun db:migrate   # Run migrations
bun db:push      # Push schema changes
bun db:studio    # Open Drizzle Studio (dev)

# Durable Objects (Per-User Database)
cd apps/server && bun do:generate  # Generate DO migrations
```

### Deployment

```bash
# Deploy to production (uses .env.prod)
bun a:deploy

# Destroy deployment
bun a:destroy
```

## Environment Setup

### Required Environment Files

This project uses stage-specific environment files for development and production. You need to create the following files:

#### Root Directory

**`.env.dev`** (development):

```bash
# Alchemy Configuration
ALCHEMY_STAGE=dev

# API Configuration (use placeholder domains for dev)
API_ROUTE_PATTERN=api.example.com/*
CUSTOM_WEB_DOMAIN=example.com

# Server URLs (actual local URLs)
VITE_SERVER_URL=http://localhost:3000
VITE_WEB_URL=http://localhost:3001

# Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-dev-secret-key-here
CORS_ORIGIN=http://localhost:3001
```

**`.env.prod`** (production):

```bash
# Alchemy Configuration
ALCHEMY_STAGE=prod

# API Configuration
API_ROUTE_PATTERN=api.yourdomain.com/*
CUSTOM_WEB_DOMAIN=yourdomain.com

# Server URLs
VITE_SERVER_URL=https://api.yourdomain.com
VITE_WEB_URL=https://yourdomain.com

# Auth Configuration
BETTER_AUTH_URL=https://api.yourdomain.com
BETTER_AUTH_SECRET=your-production-secret-key-here
CORS_ORIGIN=https://yourdomain.com
```

#### App-Specific Files (Optional)

**`apps/web/.env.dev`** and **`apps/web/.env.prod`**:

```bash
VITE_SERVER_URL=http://localhost:3000  # or production URL
VITE_WEB_URL=http://localhost:3001     # or production URL
```

**`apps/server/.env.dev`** and **`apps/server/.env.prod`**:

```bash
# Only needed if you want to override root-level variables
# for server-specific configuration
```

### Key Environment Variables

| Variable             | Description                               | Required |
| -------------------- | ----------------------------------------- | -------- |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth (min 32 chars) | ✅       |
| `BETTER_AUTH_URL`    | Base URL for auth endpoints               | ✅       |
| `CORS_ORIGIN`        | Allowed origin for CORS                   | ✅       |
| `VITE_SERVER_URL`    | Backend API URL for frontend              | ✅       |
| `VITE_WEB_URL`       | Frontend URL                              | ✅       |
| `API_ROUTE_PATTERN`  | Cloudflare route pattern for API          | ✅       |
| `CUSTOM_WEB_DOMAIN`  | Cloudflare domain for web app             | ✅       |

### Notes

-  **Development**: Files are loaded from `.env.dev` when running `bun a:dev`
-  **Production**: Files are loaded from `.env.prod` when running `bun a:deploy`
-  For **local development**, use placeholder domains (e.g., `example.com`) for `API_ROUTE_PATTERN` and `CUSTOM_WEB_DOMAIN` - Alchemy will run on localhost automatically
-  The root `.env.*` files are the primary configuration sources
-  App-specific env files can override root values if needed
-  Never commit `.env.*` files to version control (they're gitignored)
-  Generate a secure `BETTER_AUTH_SECRET` with: `openssl rand -base64 32`

## Project Structure

```
apps/
├── server/           # Cloudflare Worker backend
│   ├── src/
│   │   ├── api/      # HTTP and oRPC routes
│   │   ├── domain/   # Business entities
│   │   ├── infra/    # Infrastructure (auth, db, DO)
│   │   ├── repositories/ # Data access layer
│   │   └── services/ # Business logic
│   └── package.json
└── web/              # React frontend
    ├── src/
    │   ├── components/ # UI components
    │   ├── routes/     # File-based routes
    │   └── lib/        # Utilities
    └── package.json
```

## Example Implementation

The template includes a simple CRUD example for "items" demonstrating:

-  Domain modeling (`apps/server/src/domain/items.ts`)
-  Repository pattern (`apps/server/src/repositories/do/item-repository.ts`)
-  Service layer (`apps/server/src/services/items/item-service.ts`)
-  oRPC API (`apps/server/src/api/orpc/items-router.ts`)
-  Durable Object storage (`apps/server/src/infra/do/user-durable-object.ts`)
-  Frontend UI (`apps/web/src/routes/items/`)

## License

MIT
