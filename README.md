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
import { rateLimit } from '@hono/cloudflare-rate-limit'
import type { RateLimitBiding } from '@elithrar/hono-workers-limiter'
import { Hono } from 'hono'

type Bindings = {
    RATE_LIMITER: RateLimitBinding;
}

const app = new Hono<{Bindings: Bindings}>()

// Your RateLimitKeyFunc returns the key to rate-limit on.
// It has access to everything in the Hono Context, including
// URL path parameters, query parameters, headers, the request body,
// and context values set by other middleware.
const getKey: RateLimitKeyFunc = (c: Context): string => {
    // Rate limit on each API token by returning it as the key for our
    // middleware to use.
    return c.req.header("Authorization")
}

// Rate limit all routes across our application
app.use('*', rateLimit(binding, getKey))
app.get('/', (c) => {
    // ...
})

export default app
```

You can create multiple `rateLimit` instances, passing in different rate-limiting configurations and a `RateLimitKeyFunc` for each use-case, or apply the same `rateLimit` function to multiple route patterns via `app.use`.

For example, you might more aggressively rate-limit requests to an `/admin` endpoint and rate limit on the email address provided the `POST` request body vs. a higher, more permissive rate-limit for public routes.

### Determine if a rate limit was hit within a handler

You can determine if a rate limit was applied within a handler or middleware by calling the `didRateLimit` function and passing in the Hono `Context`.

```ts
app.use('*', rateLimit(binding, getKey, { allowOnFailure: true }))
app.get('/', (c) => {
    // Returns true if the rate limiter was invoked
    // You can also optionally get the key used to rate limit
    const { rateLimited, key } = await didRateLimit(c)
})
```

## License

Apache 2.0 licensed. See the LICENSE file for details.
