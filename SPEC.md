# cf-do-fullstack Template Specification

## Overview

**cf-do-fullstack** is a production-ready starter template demonstrating the Durable Object per-user architecture pattern on Cloudflare Workers. It transforms the existing AI chat application into a general-purpose template with a personal data vault example domain.

### Template Philosophy

| Aspect | Decision |
|--------|----------|
| **Type** | Starter kit (fork & forget) |
| **Database** | Dual-DB default (D1 + DO SQLite), single-DB documented as option |
| **Audience** | Broad range with layered documentation |
| **Core Priority** | DO-per-user pattern clarity |

---

## MVP Scope (v1.0)

### Features

- **Authentication**: Full Better Auth (email OTP, social providers, KV sessions)
- **Vault CRUD**: Create, read, update, delete vault items
- **Basic UI**: Functional but minimal interface (profile, appearance, usage settings)
- **Critical Path Tests**: Auth flows and DO operations

### Deferred to v1.1

- Tagged items with many-to-many relationships
- FTS5 full-text search
- Data export (GDPR compliance)
- Account deletion flow
- Saga/compensation patterns for cross-DB consistency
- Comprehensive test coverage

---

## Architecture

### Stack

| Layer | Technology |
|-------|------------|
| **Deployment** | Alchemy (required) |
| **Backend** | Cloudflare Workers, Hono |
| **Frontend** | React 19, TanStack Router, shadcn/ui, Tailwind |
| **API** | oRPC (default), document tRPC and plain REST alternatives |
| **Databases** | D1 (shared data) + DO SQLite (per-user data) |
| **Auth** | Better Auth with email OTP and social providers |
| **Tooling** | Biome (lint/format), Turborepo (monorepo) |

### Functional Feature-Based Architecture (Strictly Enforced)

```
features/[feature]/
  ├── routes.ts      # Thin API layer (validation only)
  ├── handlers.ts    # Business logic orchestration
  ├── queries.ts     # Database reads
  ├── mutations.ts   # Database writes
  ├── utils.ts       # Pure utility functions
  ├── types.ts       # TypeScript types
  └── constants.ts   # Constants (optional)
```

**Principles:**
1. 100% functional - no classes, only pure functions
2. Thin routes - validate input, call handlers, return response
3. Clear read/write separation (queries vs mutations)
4. Feature colocation - all related code in one directory

### Database Architecture

#### D1 (Shared/Global Data)
- Authentication tables
- User settings/preferences
- Usage tracking and quotas
- Suggested/common tags (v1.1)

#### Durable Object SQLite (Per-User Data)
- Vault items and collections
- User-created tags (v1.1)
- Search indices (v1.1)

---

## Example Domain: Personal Data Vault

### Data Model (MVP)

```typescript
// Vault Item - moderate complexity + extensible pattern
interface VaultItem {
  id: string
  title: string
  content: string           // Main content field
  contentType: string       // 'text', 'json', 'markdown', etc.
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
  metadata: Record<string, unknown>  // Extensibility point
}
```

### Data Model (v1.1 - Tags & Search)

```typescript
// User-created tags (stored in DO)
interface Tag {
  id: string
  name: string
  color?: string
  createdAt: string
}

// Suggested tags (stored in D1)
interface SuggestedTag {
  id: string
  name: string
  category: string
}

// Item-Tag relationship
interface ItemTag {
  itemId: string
  tagId: string
}

// FTS5 virtual table for search
// CREATE VIRTUAL TABLE vault_items_fts USING fts5(title, content, content=vault_items)
```

### UI Structure

- **Home/Dashboard**: Vault item list with basic filtering
- **Item View/Edit**: Single item CRUD
- **Settings**:
  - Profile (user info)
  - Appearance (theme preferences)
  - Usage (quota display)

---

## Technical Requirements

### Error Handling

**Production-grade resilience required:**
- DO hibernation wake-up handling
- Retry logic for transient failures
- Circuit breaker patterns for external dependencies
- Graceful degradation when services unavailable
- Structured error responses with error codes

### Observability

- Structured logging throughout
- Consistent log levels (debug, info, warn, error)
- Request correlation IDs
- CF-compatible log output format

### Data Fetching (Frontend)

**Full React Query patterns:**
- Optimistic updates for mutations
- Smart cache invalidation
- Prefetching for navigation
- Stale-while-revalidate patterns

### Security

- Keep encryption utilities (crypto.ts) with documentation
- Encrypted storage for sensitive fields
- Input validation at API boundaries
- CSRF protection via Better Auth

### Migrations

- Keep current auto-migrate-on-access pattern for DO
- Standard Drizzle migrations for D1
- Document migration limitations and edge cases

---

## Documentation Requirements

### README.md (Quick-start focused)

1. One-paragraph description
2. Prerequisites
3. Quick start (clone → install → configure → run)
4. Link to detailed docs
5. License

### Architecture Documentation

- `/docs/architecture.md` - System overview, data flow diagrams
- `/docs/do-per-user.md` - The core pattern explained
- `/docs/customization.md` - How to replace example domain
- `/docs/api-alternatives.md` - tRPC and REST alternatives to oRPC

### Pattern Documentation

- DO hibernation and warming strategies (documented, not implemented)
- WebSocket capabilities (documented, not implemented)
- Cross-DB consistency approaches (documented, saga patterns in v1.1)

### Environment Setup

- `.env.example` files with realistic fake values
- Clear required vs optional variable documentation
- Stage-specific setup (dev vs prod)

---

## Testing Strategy

### MVP: Critical Path Tests

```
tests/
  ├── auth/
  │   ├── signup.test.ts
  │   ├── login.test.ts
  │   └── session.test.ts
  ├── do/
  │   ├── stub-access.test.ts
  │   ├── crud-operations.test.ts
  │   └── migration.test.ts
  └── integration/
      └── auth-to-do-flow.test.ts
```

### v1.1: Comprehensive Coverage

- UI component tests
- API endpoint tests
- Error handling edge cases
- Performance benchmarks

---

## Repository Structure

```
cf-do-fullstack/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # Shared UI components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Utilities (orpc, auth-client)
│   │   │   └── routes/         # TanStack Router pages
│   │   └── ...
│   └── server/                 # Cloudflare Worker backend
│       ├── src/
│       │   ├── db/
│       │   │   ├── d1/         # D1 schema & migrations
│       │   │   └── do/         # DO schema & migrations
│       │   ├── features/       # Feature modules
│       │   │   ├── vault/      # Example domain (NEW)
│       │   │   ├── settings/   # User preferences
│       │   │   ├── usage/      # Quota tracking
│       │   │   └── profile/    # User profile
│       │   └── lib/            # Shared utilities
│       └── ...
├── docs/                       # Documentation (NEW)
├── tests/                      # Test suites (NEW)
├── alchemy.run.ts              # Deployment config
├── SPEC.md                     # This file
├── README.md                   # Quick-start docs
└── ...
```

---

## Implementation Approach

### Method: Branch Comparison

1. Build vault example on current branch (`refactor/template`)
2. Remove AI chat domain code incrementally
3. Validate patterns work at each step
4. Merge to `main` when complete

### Documentation Timing

- Write docs alongside code (not as separate phase)
- Each feature PR includes relevant documentation
- Prevents documentation debt

---

## Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| **License** | MIT |
| **Node Version** | 18+ (match current) |
| **Package Manager** | Bun |
| **Code Style** | Biome (current config) |
| **Git Workflow** | Keep current GitHub setup |

---

## Success Criteria

### MVP Complete When:

1. User can clone, configure, and run the template
2. Authentication flow works (signup, login, logout)
3. Vault CRUD operations work through DO
4. Settings pages functional (profile, appearance, usage)
5. README explains quick start
6. Architecture doc explains the DO-per-user pattern
7. Critical path tests pass

### Template Quality Bar:

- DO-per-user pattern is crystal clear
- Code is well-structured and follows functional architecture
- No remnants of AI chat domain
- Works on first clone with documented setup

---

## Version Roadmap

### v1.0 (MVP)
- Auth + Vault CRUD + Basic UI
- README + Architecture docs
- Critical path tests

### v1.1
- Tagged items with FTS5 search
- Data export endpoint
- Account deletion flow
- Saga/compensation patterns
- Comprehensive tests

### v1.2+
- Multiple example domains (optional)
- Performance optimization docs
- Deployment guides for different scenarios

---

## Appendix: Interview Decision Log

| Topic | Decision |
|-------|----------|
| Template type | Starter kit (fork & forget) |
| DB architecture | Dual-DB default, single-DB documented |
| Target audience | Broad range, layered docs |
| Domain content | Personal data vault example |
| Auth approach | Keep Better Auth fully |
| Deployment | Alchemy required |
| Example domain | Typed collections + document store with queries |
| Architecture enforcement | Strictly enforce functional pattern |
| API layer | oRPC default, document alternatives |
| Frontend stack | Keep React 19 + TanStack Router + shadcn/ui |
| UI polish | Functional but basic |
| Error handling | Production-grade resilience |
| DO migrations | Keep auto-migration pattern |
| Settings location | Keep in D1 |
| Usage system | Keep full implementation |
| Encryption | Keep utilities with docs |
| Testing | Comprehensive (critical path for MVP) |
| First-run experience | Manual setup with clear docs |
| Repo structure | Keep monorepo with Turborepo |
| Template name | cf-do-fullstack |
| Documentation | Comprehensive in-repo docs |
| Removal approach | Branch comparison |
| Tag storage | Hybrid (user in DO, suggested in D1) |
| Item schema | Moderate + extensible |
| Real-time | Document WebSocket, don't implement |
| Search | SQLite FTS5 (v1.1) |
| Data export | Full implementation (v1.1) |
| Account deletion | Full flow (v1.1) |
| Cross-DB consistency | Saga patterns (v1.1) |
| React Query | Full patterns (optimistic, cache, prefetch) |
| UI error handling | Basic error states |
| README focus | Quick-start |
| Settings pages | Profile + appearance + usage |
| MVP scope | Strict MVP first |
| Docs timing | Write with code |
| Core priority | DO-per-user pattern clarity |
| License | MIT |
| Tooling | Keep biome |
