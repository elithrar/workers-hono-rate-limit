// src/middleware/cache/index.ts
var cache = (options) => {
  if (options.wait === void 0) {
    options.wait = false;
  }
  const directives = options.cacheControl?.split(",").map((directive) => directive.toLowerCase());
  const addHeader = (c) => {
    if (directives) {
      const existingDirectives = c.res.headers.get("Cache-Control")?.split(",").map((d) => d.trim().split("=", 1)[0]) ?? [];
      for (const directive of directives) {
        let [name, value] = directive.trim().split("=", 2);
        name = name.toLowerCase();
        if (!existingDirectives.includes(name)) {
          c.header("Cache-Control", `${name}${value ? `=${value}` : ""}`, { append: true });
        }
      }
    }
  };
  return async function cache2(c, next) {
    const key = c.req.url;
    const cache3 = await caches.open(options.cacheName);
    const response = await cache3.match(key);
    if (response) {
      return new Response(response.body, response);
    }
    await next();
    if (!c.res.ok) {
      return;
    }
    addHeader(c);
    const res = c.res.clone();
    if (options.wait) {
      await cache3.put(key, res);
    } else {
      c.executionCtx.waitUntil(cache3.put(key, res));
    }
  };
};
export {
  cache
};
