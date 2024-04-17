// src/middleware/pretty-json/index.ts
var prettyJSON = (options = { space: 2 }) => {
  return async function prettyJSON2(c, next) {
    const pretty = c.req.query("pretty") || c.req.query("pretty") === "" ? true : false;
    await next();
    if (pretty && c.res.headers.get("Content-Type")?.startsWith("application/json")) {
      const obj = await c.res.json();
      c.res = new Response(JSON.stringify(obj, null, options.space), c.res);
    }
  };
};
export {
  prettyJSON
};
