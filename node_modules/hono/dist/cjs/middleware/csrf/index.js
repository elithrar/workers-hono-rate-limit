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
var csrf_exports = {};
__export(csrf_exports, {
  csrf: () => csrf
});
module.exports = __toCommonJS(csrf_exports);
var import_http_exception = require("../../http-exception");
const isSafeMethodRe = /^(GET|HEAD)$/;
const isRequestedByFormElementRe = /^\b(application\/x-www-form-urlencoded|multipart\/form-data|text\/plain)\b/;
const csrf = (options) => {
  const handler = ((optsOrigin) => {
    if (!optsOrigin) {
      return (origin, c) => origin === new URL(c.req.url).origin;
    } else if (typeof optsOrigin === "string") {
      return (origin) => origin === optsOrigin;
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin);
    }
  })(options?.origin);
  const isAllowedOrigin = (origin, c) => {
    if (origin === void 0) {
      return false;
    }
    return handler(origin, c);
  };
  return async function cors(c, next) {
    if (!isSafeMethodRe.test(c.req.method) && isRequestedByFormElementRe.test(c.req.header("content-type") || "") && !isAllowedOrigin(c.req.header("origin"), c)) {
      const res = new Response("Forbidden", {
        status: 403
      });
      throw new import_http_exception.HTTPException(403, { res });
    }
    await next();
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  csrf
});
