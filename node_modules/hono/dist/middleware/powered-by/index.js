// src/middleware/powered-by/index.ts
var poweredBy = () => {
  return async function poweredBy2(c, next) {
    await next();
    c.res.headers.set("X-Powered-By", "Hono");
  };
};
export {
  poweredBy
};
