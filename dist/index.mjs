import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

const RATE_LIMIT_CONTEXT_KEY = "rateLimitPassed";
const STATUS_TOO_MANY_REQUESTS = 429;
const DEFAULT_RATE_LIMIT_MESSAGE = "rate limited";
const normalizeRateLimitKey = (rawKey) => rawKey.trim();
const rateLimit = (rateLimitBinding, keyFunc, options = {}) => {
  const message = options.message ?? DEFAULT_RATE_LIMIT_MESSAGE;
  return createMiddleware(async (c, next) => {
    const key = normalizeRateLimitKey(await keyFunc(c));
    if (!key) {
      console.warn("the provided keyFunc returned an empty rate limiting key: bypassing rate limits");
      await next();
      return;
    }
    const { success } = await rateLimitBinding.limit({ key });
    c.set(RATE_LIMIT_CONTEXT_KEY, success);
    if (!success) {
      throw new HTTPException(STATUS_TOO_MANY_REQUESTS, { message });
    }
    await next();
  });
};
const rateLimitPassed = (c) => {
  return c.get(RATE_LIMIT_CONTEXT_KEY);
};

export { DEFAULT_RATE_LIMIT_MESSAGE, rateLimit, rateLimitPassed };
