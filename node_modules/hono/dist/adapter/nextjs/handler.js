// src/adapter/nextjs/handler.ts
import { Hono } from "../../hono.js";
var handle = (subApp, path) => (req) => {
  const app = path ? new Hono().route(path, subApp) : subApp;
  return app.fetch(req);
};
export {
  handle
};
