import { Context, MiddlewareHandler } from 'hono';

/**
 * Rate limiting binding as defined by Cloudflare Workers.
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
 */
interface RateLimitBinding {
    limit(options: {
        key: string;
    }): Promise<{
        success: boolean;
    }>;
}
/**
 * Function that returns the key to rate limit on for a given request.
 * The key should represent a unique characteristic of a user or class of user.
 */
type RateLimitKeyFunc = (c: Context) => string | Promise<string>;
/**
 * Creates a rate limiting middleware for Hono applications.
 *
 * @param rateLimitBinding - The rate limit binding from your Worker's env
 * @param keyFunc - Function that returns the key to rate limit on
 * @returns Hono middleware handler
 *
 * @example
 * ```ts
 * const getKey: RateLimitKeyFunc = (c) => c.req.header("Authorization") || "";
 * app.use("*", (c, next) => rateLimit(c.env.RATE_LIMITER, getKey)(c, next));
 * ```
 */
declare const rateLimit: (rateLimitBinding: RateLimitBinding, keyFunc: RateLimitKeyFunc) => MiddlewareHandler;
/**
 * Check if the current request was rate limited.
 * Returns true if the request passed rate limiting, false if it was limited.
 */
declare const wasRateLimited: (c: Context) => boolean;

export { rateLimit, wasRateLimited };
export type { RateLimitBinding, RateLimitKeyFunc };
