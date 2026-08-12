# @elithrar/workers-hono-rate-limit

## 0.5.4

- Fix packaging: proper `exports` types map, `prepublishOnly` build, stop tracking `dist/` in git.
- Add Workers integration tests against `test-worker.ts` with a real `ratelimits` binding.
- Guard empty/whitespace `message` option; tighten `rateLimitPassed` context typing.
- Document empty-key bypass semantics, middleware reuse pattern, and tested Hono version.
- Add CI format check and npm release workflow on tag push.
- Narrow peer dependency to `hono >= 4.4.0`.

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

- Maintenance release under the `@elithrar/workers-hono-rate-limit` package name.

## 0.5.0 and earlier

Prior releases were published as `@hono/cloudflare-rate-limit`.
