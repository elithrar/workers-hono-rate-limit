import { Context, MiddlewareHandler } from 'hono';

declare const DEFAULT_RATE_LIMIT_MESSAGE = "rate limited";
/**
 * Context variables set by the rate limiting middleware.
 * Chain this middleware before handlers to access `c.var.rateLimitPassed`.
 */
type RateLimitVariables = {
    rateLimitPassed: boolean;
};
/**
 * Rate limiting binding as defined by Cloudflare Workers.
 * Compatible with the `RateLimit` interface from `@cloudflare/workers-types`.
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
 * Optional configuration for the rate limiting middleware.
 */
interface RateLimitOptions {
    /** Response body when a request is rate limited. Defaults to `"rate limited"`. */
    message?: string;
}
/**
 * Creates a rate limiting middleware for Hono applications.
 *
 * @param rateLimitBinding - The rate limit binding from your Worker's env
 * @param keyFunc - Function that returns the key to rate limit on
 * @param options - Optional middleware configuration
 * @returns Hono middleware handler
 *
 * @example
 * ```ts
 * const getKey: RateLimitKeyFunc = (c) => c.req.header("Authorization") || "";
 * app.use("*", (c, next) => rateLimit(c.env.RATE_LIMITER, getKey)(c, next));
 * ```
 */
declare const rateLimit: (rateLimitBinding: RateLimitBinding, keyFunc: RateLimitKeyFunc, options?: RateLimitOptions) => MiddlewareHandler<{
    Variables: RateLimitVariables;
}>;
/**
 * Check if the current request passed rate limiting.
 * Returns true if the request was allowed through, false if it was rate limited,
 * or undefined if the rate limiting middleware was not applied.
 */
declare const rateLimitPassed: (c: Context) => boolean | undefined;

export { DEFAULT_RATE_LIMIT_MESSAGE, rateLimit, rateLimitPassed };
export type { RateLimitBinding, RateLimitKeyFunc, RateLimitOptions, RateLimitVariables };
