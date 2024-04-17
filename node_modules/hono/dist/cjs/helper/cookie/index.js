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
var cookie_exports = {};
__export(cookie_exports, {
  deleteCookie: () => deleteCookie,
  getCookie: () => getCookie,
  getSignedCookie: () => getSignedCookie,
  setCookie: () => setCookie,
  setSignedCookie: () => setSignedCookie
});
module.exports = __toCommonJS(cookie_exports);
var import_cookie = require("../../utils/cookie");
const getCookie = (c, key) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    const obj2 = (0, import_cookie.parse)(cookie, key);
    return obj2[key];
  }
  if (!cookie) {
    return {};
  }
  const obj = (0, import_cookie.parse)(cookie);
  return obj;
};
const getSignedCookie = async (c, secret, key) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    const obj2 = await (0, import_cookie.parseSigned)(cookie, secret, key);
    return obj2[key];
  }
  if (!cookie) {
    return {};
  }
  const obj = await (0, import_cookie.parseSigned)(cookie, secret);
  return obj;
};
const setCookie = (c, name, value, opt) => {
  const cookie = (0, import_cookie.serialize)(name, value, { path: "/", ...opt });
  c.header("set-cookie", cookie, { append: true });
};
const setSignedCookie = async (c, name, value, secret, opt) => {
  const cookie = await (0, import_cookie.serializeSigned)(name, value, secret, { path: "/", ...opt });
  c.header("set-cookie", cookie, { append: true });
};
const deleteCookie = (c, name, opt) => {
  setCookie(c, name, "", { ...opt, maxAge: 0 });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteCookie,
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie
});
