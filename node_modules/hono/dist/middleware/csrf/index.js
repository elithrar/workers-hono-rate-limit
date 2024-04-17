// src/middleware/csrf/index.ts
import { HTTPException } from "../../http-exception.js";
var isSafeMethodRe = /^(GET|HEAD)$/;
var isRequestedByFormElementRe = /^\b(application\/x-www-form-urlencoded|multipart\/form-data|text\/plain)\b/;
var csrf = (options) => {
  const handler = ((optsOrigin) => {
    if (!optsOrigin) {
      return (origin, c) => origin === new URL(c.req.url).origin;
    } else if (typeof optsOrigin === "string") {
      return (origin) => origin === optsOrigin;
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin);
    }
  })(options?.origin);
  const isAllowedOrigin = (origin, c) => {
    if (origin === void 0) {
      return false;
    }
    return handler(origin, c);
  };
  return async function cors(c, next) {
    if (!isSafeMethodRe.test(c.req.method) && isRequestedByFormElementRe.test(c.req.header("content-type") || "") && !isAllowedOrigin(c.req.header("origin"), c)) {
      const res = new Response("Forbidden", {
        status: 403
      });
      throw new HTTPException(403, { res });
    }
    await next();
  };
};
export {
  csrf
};
