import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

const RATE_LIMIT_CONTEXT_KEY = "rateLimitPassed";
const STATUS_TOO_MANY_REQUESTS = 429;
const DEFAULT_RATE_LIMIT_MESSAGE = "rate limited";
const rateLimit = (rateLimitBinding, keyFunc) => {
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
        message: DEFAULT_RATE_LIMIT_MESSAGE
      });
    }
    await next();
  });
};
const rateLimitPassed = (c) => {
  return c.get(RATE_LIMIT_CONTEXT_KEY);
};

export { rateLimit, rateLimitPassed };
