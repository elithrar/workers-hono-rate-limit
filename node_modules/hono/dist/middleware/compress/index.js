// src/middleware/compress/index.ts
var ENCODING_TYPES = ["gzip", "deflate"];
var compress = (options) => {
  return async function compress2(ctx, next) {
    await next();
    const accepted = ctx.req.headers.get("Accept-Encoding");
    const encoding = options?.encoding ?? ENCODING_TYPES.find((encoding2) => accepted?.includes(encoding2));
    if (!encoding || !ctx.res.body) {
      return;
    }
    const stream = new CompressionStream(encoding);
    ctx.res = new Response(ctx.res.body.pipeThrough(stream), ctx.res);
    ctx.res.headers.delete("Content-Length");
    ctx.res.headers.set("Content-Encoding", encoding);
  };
};
export {
  compress
};
