# @elithrar/workers-hono-rate-limit

`@elithrar/workers-hono-rate-limit` is Hono middleware that allows you to use Cloudflare Worker's [rate limiting bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) directly in your Hono applications.

## Install

To install this into your Hono project:

```sh
$ npm install @elithrar/workers-hono-rate-limit
```

## Usage

To use the rate limiter middleware:

1. Create a [rate limiting binding](#) in your `wrangler.toml` configuration
2. Define a `RateLimitKeyFunc`: this is a function that returns the key to rate limit on for a given request. A `RateLimitKeyFunc` is simply a function that accepts a Hono `Context` and returns a `string`.
3. Apply the `rateLimit` middleware to your application or routes.

The below example shows how to use the `rateLimit` middleware within a Hono app:

```toml
# wrangler.toml

[[unsafe.bindings]]
name = "RATE_LIMITER"
type = "ratelimit"
namespace_id = "1001"
# 20 requests per 10 seconds
simple = { limit = 25, period = 10 }
```

Your corresponding Hono-based Worker would then resemble this:

```ts
import { rateLimit, RateLimitBinding, RateLimitKeyFunc } from "@elithrar/workers-hono-rate-limit";
import { Hono, Context, Next } from "hono";

type Bindings = {
	RATE_LIMITER: RateLimitBinding;
};

const app = new Hono<{ Bindings: Bindings }>();

// Your RateLimitKeyFunc returns the key to rate-limit on.
// It has access to everything in the Hono Context, including
// URL path parameters, query parameters, headers, the request body,
// and context values set by other middleware.
const getKey: RateLimitKeyFunc = (c: Context): string => {
	// Rate limit on each API token by returning it as the key for our
	// middleware to use.
	return c.req.header("Authorization") || "";
};

// Create an instance of our rate limiter, passing it the Rate Limiting bindings
const rateLimiter = async (c: Context, next: Next) => {
	return await rateLimit(c.env.RATE_LIMITER, getKey)(c, next);
};

// Rate limit all routes across our application
app.use("*", rateLimiter);
app.get("/", (c) => {
	return c.text("hello!");
});

export default app;
```

You can create multiple `rateLimit` instances, passing in different rate-limiting configurations and a `RateLimitKeyFunc` for each use-case, or apply the same `rateLimit` function to multiple route patterns via `app.use`.

For example, you might more aggressively rate-limit requests to an `/admin` endpoint and rate limit on the email address provided the `POST` request body vs. a higher, more permissive rate-limit for public routes.

## Notes

- The `keyFunc` that determines what to limit a request on should represent a unique characteristic of a user or class of user that you wish to rate limit. Good choices include API keys in `Authorization` headers, URL paths or routes, specific query parameters used by your application, and/or user IDs.
- It is not recommended to use IP addresses (since these can be shared by many users in many valid cases) or locations (the same), as you may find yourself unintentionally rate limiting a wider group of users than you intended.
- If your provided `keyFunc` does not return a key and instead returns an empty string, the `rateLimit` middleware will not be invoked for the current request.

## License

Apache 2.0 licensed. See the LICENSE file for details.
