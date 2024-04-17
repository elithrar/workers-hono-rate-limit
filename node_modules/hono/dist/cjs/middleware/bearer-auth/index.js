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
var bearer_auth_exports = {};
__export(bearer_auth_exports, {
  bearerAuth: () => bearerAuth
});
module.exports = __toCommonJS(bearer_auth_exports);
var import_http_exception = require("../../http-exception");
var import_buffer = require("../../utils/buffer");
const TOKEN_STRINGS = "[A-Za-z0-9._~+/-]+=*";
const PREFIX = "Bearer";
const bearerAuth = (options) => {
  if (!options.token) {
    throw new Error('bearer auth middleware requires options for "token"');
  }
  if (!options.realm) {
    options.realm = "";
  }
  if (!options.prefix) {
    options.prefix = PREFIX;
  }
  const realm = options.realm?.replace(/"/g, '\\"');
  return async function bearerAuth2(c, next) {
    const headerToken = c.req.header("Authorization");
    if (!headerToken) {
      const res = new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": `${options.prefix} realm="` + realm + '"'
        }
      });
      throw new import_http_exception.HTTPException(401, { res });
    } else {
      const regexp = new RegExp("^" + options.prefix + " +(" + TOKEN_STRINGS + ") *$");
      const match = regexp.exec(headerToken);
      if (!match) {
        const res = new Response("Bad Request", {
          status: 400,
          headers: {
            "WWW-Authenticate": `${options.prefix} error="invalid_request"`
          }
        });
        throw new import_http_exception.HTTPException(400, { res });
      } else {
        let equal = false;
        if (typeof options.token === "string") {
          equal = await (0, import_buffer.timingSafeEqual)(options.token, match[1], options.hashFunction);
        } else if (Array.isArray(options.token) && options.token.length > 0) {
          for (const token of options.token) {
            if (await (0, import_buffer.timingSafeEqual)(token, match[1], options.hashFunction)) {
              equal = true;
              break;
            }
          }
        }
        if (!equal) {
          const res = new Response("Unauthorized", {
            status: 401,
            headers: {
              "WWW-Authenticate": `${options.prefix} error="invalid_token"`
            }
          });
          throw new import_http_exception.HTTPException(401, { res });
        }
      }
    }
    await next();
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bearerAuth
});
