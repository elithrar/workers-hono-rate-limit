// src/adapter/cloudflare-workers/serve-static.ts
import { getFilePath } from "../../utils/filepath.js";
import { getMimeType } from "../../utils/mime.js";
import { getContentFromKVAsset } from "./utils.js";
var DEFAULT_DOCUMENT = "index.html";
var serveStatic = (options = { root: "" }) => {
  return async (c, next) => {
    if (c.finalized) {
      await next();
      return;
    }
    const url = new URL(c.req.url);
    const filename = options.path ?? decodeURI(url.pathname);
    const path = getFilePath({
      filename: options.rewriteRequestPath ? options.rewriteRequestPath(filename) : filename,
      root: options.root,
      defaultDocument: DEFAULT_DOCUMENT
    });
    if (!path) {
      return await next();
    }
    const content = await getContentFromKVAsset(path, {
      manifest: options.manifest,
      namespace: options.namespace ? options.namespace : c.env ? c.env.__STATIC_CONTENT : void 0
    });
    if (content) {
      const mimeType = getMimeType(path);
      if (mimeType) {
        c.header("Content-Type", mimeType);
      }
      return c.body(content);
    }
    await options.onNotFound?.(path, c);
    await next();
    return;
  };
};
export {
  serveStatic
};
