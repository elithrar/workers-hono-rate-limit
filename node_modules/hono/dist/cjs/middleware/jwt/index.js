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
var jwt_exports = {};
__export(jwt_exports, {
  decode: () => decode,
  jwt: () => jwt,
  sign: () => sign,
  verify: () => verify
});
module.exports = __toCommonJS(jwt_exports);
var import_http_exception = require("../../http-exception");
var import_jwt = require("../../utils/jwt");
var import_context = require("../../context");
const jwt = (options) => {
  if (!options) {
    throw new Error('JWT auth middleware requires options for "secret');
  }
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  return async function jwt2(ctx, next) {
    const credentials = ctx.req.headers.get("Authorization");
    let token;
    if (credentials) {
      const parts = credentials.split(/\s+/);
      if (parts.length !== 2) {
        throw new import_http_exception.HTTPException(401, {
          res: unauthorizedResponse({
            ctx,
            error: "invalid_request",
            errDescription: "invalid credentials structure"
          })
        });
      } else {
        token = parts[1];
      }
    } else if (options.cookie) {
      token = ctx.req.cookie(options.cookie);
    }
    if (!token) {
      throw new import_http_exception.HTTPException(401, {
        res: unauthorizedResponse({
          ctx,
          error: "invalid_request",
          errDescription: "no authorization included in request"
        })
      });
    }
    let payload;
    let msg = "";
    try {
      payload = await import_jwt.Jwt.verify(token, options.secret, options.alg);
    } catch (e) {
      msg = `${e}`;
    }
    if (!payload) {
      throw new import_http_exception.HTTPException(401, {
        res: unauthorizedResponse({
          ctx,
          error: "invalid_token",
          statusText: msg,
          errDescription: "token verification failure"
        })
      });
    }
    ctx.set("jwtPayload", payload);
    await next();
  };
};
function unauthorizedResponse(opts) {
  return new Response("Unauthorized", {
    status: 401,
    statusText: opts.statusText,
    headers: {
      "WWW-Authenticate": `Bearer realm="${opts.ctx.req.url}",error="${opts.error}",error_description="${opts.errDescription}"`
    }
  });
}
const verify = import_jwt.Jwt.verify;
const decode = import_jwt.Jwt.decode;
const sign = import_jwt.Jwt.sign;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decode,
  jwt,
  sign,
  verify
});
