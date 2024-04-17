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
var etag_exports = {};
__export(etag_exports, {
  etag: () => etag
});
module.exports = __toCommonJS(etag_exports);
var import_crypto = require("../../utils/crypto");
const RETAINED_304_HEADERS = [
  "cache-control",
  "content-location",
  "date",
  "etag",
  "expires",
  "vary"
];
function etagMatches(etag2, ifNoneMatch) {
  return ifNoneMatch != null && ifNoneMatch.split(/,\s*/).indexOf(etag2) > -1;
}
const etag = (options) => {
  const retainedHeaders = options?.retainedHeaders ?? RETAINED_304_HEADERS;
  const weak = options?.weak ?? false;
  return async function etag2(c, next) {
    const ifNoneMatch = c.req.header("If-None-Match") ?? null;
    await next();
    const res = c.res;
    let etag3 = res.headers.get("ETag");
    if (!etag3) {
      const hash = await (0, import_crypto.sha1)(res.clone().body || "");
      etag3 = weak ? `W/"${hash}"` : `"${hash}"`;
    }
    if (etagMatches(etag3, ifNoneMatch)) {
      await c.res.blob();
      c.res = new Response(null, {
        status: 304,
        statusText: "Not Modified",
        headers: {
          ETag: etag3
        }
      });
      c.res.headers.forEach((_, key) => {
        if (retainedHeaders.indexOf(key.toLowerCase()) === -1) {
          c.res.headers.delete(key);
        }
      });
    } else {
      c.res.headers.set("ETag", etag3);
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  etag
});
