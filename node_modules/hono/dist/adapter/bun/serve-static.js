// src/adapter/bun/serve-static.ts
import { getFilePath } from "../../utils/filepath.js";
import { getMimeType } from "../../utils/mime.js";
var DEFAULT_DOCUMENT = "index.html";
var serveStatic = (options = { root: "" }) => {
  return async (c, next) => {
    if (c.finalized) {
      await next();
      return;
    }
    const url = new URL(c.req.url);
    const filename = options.path ?? decodeURI(url.pathname);
    let path = getFilePath({
      filename: options.rewriteRequestPath ? options.rewriteRequestPath(filename) : filename,
      root: options.root,
      defaultDocument: DEFAULT_DOCUMENT
    });
    if (!path) {
      return await next();
    }
    path = `./${path}`;
    const file = Bun.file(path);
    const isExists = await file.exists();
    if (isExists) {
      const mimeType = getMimeType(path);
      if (mimeType) {
        c.header("Content-Type", mimeType);
      }
      return c.body(file);
    }
    await options.onNotFound?.(path, c);
    await next();
    return;
  };
};
export {
  serveStatic
};
