// src/adapter/cloudflare-workers/serve-static-module.ts
import manifest from "__STATIC_CONTENT_MANIFEST";
import { serveStatic } from "./serve-static.js";
var module = (options = { root: "" }) => {
  options.manifest ?? (options.manifest = manifest);
  return serveStatic(options);
};
export {
  module as serveStatic
};
