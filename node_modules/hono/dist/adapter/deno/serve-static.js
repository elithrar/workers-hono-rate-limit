// src/adapter/deno/serve-static.ts
import { getFilePath } from "../../utils/filepath.js";
import { getMimeType } from "../../utils/mime.js";
var { open } = Deno;
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
    let file;
    try {
      file = await open(path);
    } catch (e) {
      console.warn(`${e}`);
    }
    if (file) {
      const mimeType = getMimeType(path);
      if (mimeType) {
        c.header("Content-Type", mimeType);
      }
      return c.body(file.readable);
    }
    await options.onNotFound?.(path, c);
    await next();
    return;
  };
};
export {
  serveStatic
};
