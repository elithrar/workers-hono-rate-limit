import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

const RATE_LIMIT_CONTEXT_KEY = ".rateLimited";
const STATUS_TOO_MANY_REQUESTS = 429;
const rateLimit = (binding, keyFunc, options) => {
  return createMiddleware(async (c, next) => {
    let key = keyFunc(c);
    if (key) {
      let { success } = await binding.limit({ key });
      if (!success) {
        c.set(RATE_LIMIT_CONTEXT_KEY, false);
        if (!options?.continueOnRateLimit) {
          throw new HTTPException(STATUS_TOO_MANY_REQUESTS, {
            res: c.text("rate limited", { status: STATUS_TOO_MANY_REQUESTS })
          });
        }
      }
    }
    await next();
  });
};
const wasRateLimited = (c) => {
  return c.get(RATE_LIMIT_CONTEXT_KEY);
};

export { rateLimit, wasRateLimited };
