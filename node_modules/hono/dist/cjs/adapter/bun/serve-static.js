"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var serve_static_exports = {};
__export(serve_static_exports, {
  serveStatic: () => serveStatic
});
module.exports = __toCommonJS(serve_static_exports);
var import_filepath = require("../../utils/filepath");
var import_mime = require("../../utils/mime");
const DEFAULT_DOCUMENT = "index.html";
const serveStatic = (options = { root: "" }) => {
  return async (c, next) => {
    if (c.finalized) {
      await next();
      return;
    }
    const url = new URL(c.req.url);
    const filename = options.path ?? decodeURI(url.pathname);
    let path = (0, import_filepath.getFilePath)({
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
      const mimeType = (0, import_mime.getMimeType)(path);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  serveStatic
});
