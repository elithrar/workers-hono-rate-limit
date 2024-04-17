import { createMiddleware } from "hono/factory";
import type { Context, Next, ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

const RATE_LIMIT_CONTEXT_KEY = ".rateLimited";
const STATUS_TOO_MANY_REQUESTS = 429;

export interface RateLimitBinding {
  limit: LimitFunc;
}

export interface LimitFunc {
  (options: LimitOptions): Promise<RateLimitResult>;
}

interface RateLimitResult {
  success: boolean;
}

export interface LimitOptions {
  key: string;
}

export interface RateLimitResponse {
  key: string;
  success: boolean;
}

export interface RateLimitOptions {
  continueOnRateLimit: boolean;
}

export type RateLimitKeyFunc = {
  (c: Context): string;
};

export const rateLimit = (
  binding: RateLimitBinding,
  keyFunc: RateLimitKeyFunc,
  options?: RateLimitOptions
) => {
  return createMiddleware(async (c: Context, next: Next) => {
    let key = keyFunc(c);
    if (key) {
      let { success } = await binding.limit({ key: key });

      if (!success) {
        c.set(RATE_LIMIT_CONTEXT_KEY, false);

        if (!options?.continueOnRateLimit) {
          throw new HTTPException(STATUS_TOO_MANY_REQUESTS, {
            res: c.text("rate limited", { status: STATUS_TOO_MANY_REQUESTS }),
          });
        }
      }
    }

    // Call the next handler/middleware in the stack on success
    await next();
  });
};

export const wasRateLimited = (c: Context): boolean => {
  return c.get(RATE_LIMIT_CONTEXT_KEY) as boolean;
};
