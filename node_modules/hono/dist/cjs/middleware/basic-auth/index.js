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
var basic_auth_exports = {};
__export(basic_auth_exports, {
  basicAuth: () => basicAuth
});
module.exports = __toCommonJS(basic_auth_exports);
var import_http_exception = require("../../http-exception");
var import_buffer = require("../../utils/buffer");
var import_encode = require("../../utils/encode");
const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;
const USER_PASS_REGEXP = /^([^:]*):(.*)$/;
const utf8Decoder = new TextDecoder();
const auth = (req) => {
  const match = CREDENTIALS_REGEXP.exec(req.headers.get("Authorization") || "");
  if (!match) {
    return void 0;
  }
  let userPass = void 0;
  try {
    userPass = USER_PASS_REGEXP.exec(utf8Decoder.decode((0, import_encode.decodeBase64)(match[1])));
  } catch {
  }
  if (!userPass) {
    return void 0;
  }
  return { username: userPass[1], password: userPass[2] };
};
const basicAuth = (options, ...users) => {
  if (!options) {
    throw new Error('basic auth middleware requires options for "username and password"');
  }
  if (!options.realm) {
    options.realm = "Secure Area";
  }
  users.unshift({ username: options.username, password: options.password });
  return async function basicAuth2(ctx, next) {
    const requestUser = auth(ctx.req);
    if (requestUser) {
      for (const user of users) {
        const [usernameEqual, passwordEqual] = await Promise.all([
          (0, import_buffer.timingSafeEqual)(user.username, requestUser.username, options.hashFunction),
          (0, import_buffer.timingSafeEqual)(user.password, requestUser.password, options.hashFunction)
        ]);
        if (usernameEqual && passwordEqual) {
          await next();
          return;
        }
      }
    }
    const res = new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="' + options.realm?.replace(/"/g, '\\"') + '"'
      }
    });
    throw new import_http_exception.HTTPException(401, { res });
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  basicAuth
});
