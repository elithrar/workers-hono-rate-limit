# @elithrar/workers-hono-rate-limit

## 0.5.3

- Add optional `message` option to customize the 429 response body.
- Trim rate limit keys and treat whitespace-only keys as empty to close bypass vectors.

## 0.5.2

- Add `RateLimitVariables` type for Hono context variable inference when chaining middleware.
- Use Hono-recommended `createMiddleware` variable typing (`c.var.rateLimitPassed`).
- Simplify 429 responses via `HTTPException` message handling.
- Fix broken `test-worker.ts` import (`wasRateLimited` → `rateLimitPassed`).
- Update dev dependencies (Hono 4.12.x, Vitest 4.x, Wrangler 4.105.x).

## 0.5.1

Prior releases under `@hono/cloudflare-rate-limit`.
