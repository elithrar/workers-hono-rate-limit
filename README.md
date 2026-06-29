# @elithrar/workers-hono-rate-limit

[![Build & Test](https://github.com/elithrar/workers-hono-rate-limit/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/elithrar/workers-hono-rate-limit/actions/workflows/build.yml)

Hono middleware for Cloudflare Worker's [rate limiting bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

## Install

```sh
npm install @elithrar/workers-hono-rate-limit
```

## Usage

1. Add a rate limiting binding to your `wrangler.toml` (or `wrangler.jsonc`)
2. Define a `RateLimitKeyFunc` that returns the key to rate limit on
3. Apply the `rateLimit` middleware to your routes

```toml
# wrangler.toml

[[ratelimits]]
binding = "RATE_LIMITER"
namespace_id = "1001"
# 25 requests per 10 seconds
simple = { limit = 25, period = 10 }
```

```ts
import { rateLimit, RateLimitBinding, RateLimitKeyFunc } from "@elithrar/workers-hono-rate-limit";
import { Hono } from "hono";

type Bindings = {
	RATE_LIMITER: RateLimitBinding;
};

const app = new Hono<{ Bindings: Bindings }>();

// Rate limit on each API token
const getKey: RateLimitKeyFunc = (c) => c.req.header("Authorization") || "";

// Apply rate limiting to all routes
app.use("*", (c, next) => rateLimit(c.env.RATE_LIMITER, getKey)(c, next));

app.get("/", (c) => c.text("hello!"));

export default app;
```

You can create multiple `rateLimit` instances with different configurations and key functions for each use-case, or apply the same instance to multiple route patterns via `app.use`.

### Custom 429 message

By default, rate-limited requests receive a `429` response with the body `rate limited`. You can override this with the optional `message` option:

```ts
app.use(
	"/api/*",
	(c, next) =>
		rateLimit(c.env.RATE_LIMITER, getKey, {
			message: "too many requests, try again later",
		})(c, next)
);
```

### Async Key Functions

The `keyFunc` can also be async if you need to look up user information:

```ts
const getKey: RateLimitKeyFunc = async (c) => {
	const user = await validateToken(c.req.header("Authorization"));
	return user?.id || "";
};
```

## Notes

- The key should represent a unique characteristic of a user or class of user. Good choices include API keys, user IDs, or tenant IDs.
- Avoid using IP addresses or locations as keys—these can be shared by many users.
- If your `keyFunc` returns an empty or whitespace-only string, rate limiting is bypassed for that request (with a console warning). Keys are trimmed before being passed to the rate limiter.

## License

Apache 2.0 licensed. See the LICENSE file for details.
