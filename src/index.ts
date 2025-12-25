import { createMiddleware } from "hono/factory";
import type { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

const RATE_LIMIT_CONTEXT_KEY = ".rateLimited";
const STATUS_TOO_MANY_REQUESTS = 429;

/**
 * Rate limiting binding as defined by Cloudflare Workers.
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
 */
export interface RateLimitBinding {
	limit(options: { key: string }): Promise<{ success: boolean }>;
}

/**
 * Function that returns the key to rate limit on for a given request.
 * The key should represent a unique characteristic of a user or class of user.
 */
export type RateLimitKeyFunc = (c: Context) => string | Promise<string>;

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
export const rateLimit = (
	rateLimitBinding: RateLimitBinding,
	keyFunc: RateLimitKeyFunc
): MiddlewareHandler => {
	return createMiddleware(async (c, next) => {
		const key = await keyFunc(c);
		if (!key) {
			console.warn("the provided keyFunc returned an empty rate limiting key: bypassing rate limits");
			await next();
			return;
		}

		const { success } = await rateLimitBinding.limit({ key });
		c.set(RATE_LIMIT_CONTEXT_KEY, success);

		if (!success) {
			throw new HTTPException(STATUS_TOO_MANY_REQUESTS, {
				res: new Response("rate limited", { status: STATUS_TOO_MANY_REQUESTS }),
			});
		}

		await next();
	});
};

/**
 * Check if the current request passed rate limiting.
 * Returns true if the request was allowed through, false if it was rate limited,
 * or undefined if the rate limiting middleware was not applied.
 */
export const rateLimitPassed = (c: Context): boolean | undefined => {
	return c.get(RATE_LIMIT_CONTEXT_KEY) as boolean | undefined;
};
