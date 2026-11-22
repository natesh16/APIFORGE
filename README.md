# APIForge — API Management & Developer Platform

A multi-tenant API management platform. Developers create workspaces,
register projects, define API routes, issue hashed API keys, and observe
traffic. The public gateway applies key authentication, Redis rate limits,
response caching, and SSRF-safe proxying; a background worker persists logs
and aggregates usage.

## Status

| Layer | Status |
|-------|--------|
| `shared/` (`@apiforge/shared`) | ✅ models, env/db/redis helpers, utils |
| `backend/` management API | ✅ auth, workspaces, projects, keys, routes, analytics, logs |
| `gateway/` data plane | ⏳ next |
| `worker/` async pipeline | ⏳ next |
| `frontend/` dashboard | ⏳ next (landing page exists) |

## Architecture

```
React dashboard ──> Management API (:5000) ──> MongoDB
                         │
                         └──> Redis (rate limits, cache, queues)
External client ──> Gateway (:5001) ──> route handler (STATIC_JSON | HTTP_PROXY)
                         │
                         └──> BullMQ ──> Worker ──> MongoDB (logs + aggregates)
```

## Repository layout

```
shared/     @apiforge/shared — Mongoose models, env/db/redis helpers, utils
backend/    Management API (Express)
gateway/    Public gateway (Express + undici + BullMQ)
worker/     BullMQ processors
frontend/   Landing page + dashboard
```

## Prerequisites

- Node.js >= 20 (tested on 25)
- MongoDB and Redis — `docker compose up -d` starts both

## Setup

```bash
npm install                              # installs all workspaces
cp backend/.env.example backend/.env     # fill in secrets
docker compose up -d                     # MongoDB + Redis
npm run dev:backend                      # http://localhost:5000
```

On Windows use `Copy-Item backend/.env.example backend/.env`. If a local
MongoDB already listens on `27017`, start only Redis with
`docker compose up -d redis` and keep `MONGODB_URI` pointed at the local server.

## API overview

All management routes are under `/api/v1` and require
`Authorization: Bearer <accessToken>` except register/login/refresh.

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/register` | Create account + personal workspace |
| POST | `/auth/login` | Access + refresh tokens |
| POST | `/auth/refresh` | New access token |
| GET | `/auth/me` | Current user |
| GET/POST | `/workspaces` | List / create workspaces |
| POST | `/workspaces/:workspaceId/members` | Invite (admin) |
| GET/POST | `/projects` | List (by `?workspaceId=`) / create |
| PATCH | `/projects/:projectId` | Update project |
| GET/POST | `/projects/:projectId/keys` | List / create API keys |
| POST | `/projects/:projectId/keys/:keyId/revoke` | Revoke |
| POST | `/projects/:projectId/keys/:keyId/rotate` | Rotate |
| GET/POST | `/projects/:projectId/routes` | List / create routes |
| PATCH/DELETE | `/projects/:projectId/routes/:routeId` | Update / delete |
| GET | `/projects/:projectId/analytics/overview` | Usage summary |
| GET | `/projects/:projectId/logs` | Paginated request logs |

Health: `GET /health`, readiness: `GET /ready`.

## Demo flow

1. `POST /auth/register` → a workspace is created automatically.
2. `POST /auth/login` → copy the access token.
3. `GET /workspaces` → note the workspace `_id`.
4. `POST /projects` with `{ workspaceId, name, slug }`.
5. `POST /projects/:projectId/keys` → **copy `rawKey` now; it is shown once.**
6. `POST /projects/:projectId/routes` with a `STATIC_JSON` handler.
7. Call the gateway (once built):
   `curl -H "X-API-Key: af_test_..." http://localhost:5001/g/<slug>/<path>`.

## Security notes

- API keys stored as HMAC-SHA-256(pepper); only the prefix is stored in clear.
- `ApiKey.toJSON()` and `User.toJSON()` redact `keyHash` / `passwordHash`.
- Project key revoke/rotate are scoped to the project in the URL.
- Tenant isolation is enforced on project listing and every project sub-route.
- Passwords hashed with bcrypt (12 rounds).
- Pino redacts authorization headers, API keys, and password fields.
- Pino structured logs; Helmet security headers.

## Tests

```bash
npm run test:backend
```

- `tests/unit/apiKey.test.js` — key format and uniqueness.
- `tests/integration/auth.test.js` — register, duplicate, login, refresh.
- `tests/integration/tenant.test.js` — cross-workspace listing and key revocation.

Integration tests use `mongodb-memory-server` (downloads a MongoDB binary on
first run).

## License

MIT
