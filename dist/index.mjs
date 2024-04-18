import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

const RATE_LIMIT_CONTEXT_KEY = ".rateLimited";
const STATUS_TOO_MANY_REQUESTS = 429;
const rateLimit = (rateLimitBinding, keyFunc) => {
  return createMiddleware(async (c, next) => {
    let key = keyFunc(c);
    if (!key) {
      console.warn("the provided keyFunc returned an empty rate limiting key: bypassing rate limits");
    }
    if (key) {
      let { success } = await rateLimitBinding.limit({ key });
      c.set(RATE_LIMIT_CONTEXT_KEY, success);
      if (!success) {
        throw new HTTPException(STATUS_TOO_MANY_REQUESTS, {
          res: c.text("rate limited", { status: STATUS_TOO_MANY_REQUESTS })
        });
      }
    }
    await next();
  });
};
const wasRateLimited = (c) => {
  return c.get(RATE_LIMIT_CONTEXT_KEY);
};

export { rateLimit, wasRateLimited };
