// src/adapter/vercel/handler.ts
var handle = (app) => (req, requestContext) => {
  return app.fetch(req, {}, requestContext);
};
export {
  handle
};
