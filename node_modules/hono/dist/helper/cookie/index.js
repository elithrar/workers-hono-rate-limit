// src/helper/cookie/index.ts
import { parse, parseSigned, serialize, serializeSigned } from "../../utils/cookie.js";
var getCookie = (c, key) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    const obj2 = parse(cookie, key);
    return obj2[key];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
};
var getSignedCookie = async (c, secret, key) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    const obj2 = await parseSigned(cookie, secret, key);
    return obj2[key];
  }
  if (!cookie) {
    return {};
  }
  const obj = await parseSigned(cookie, secret);
  return obj;
};
var setCookie = (c, name, value, opt) => {
  const cookie = serialize(name, value, { path: "/", ...opt });
  c.header("set-cookie", cookie, { append: true });
};
var setSignedCookie = async (c, name, value, secret, opt) => {
  const cookie = await serializeSigned(name, value, secret, { path: "/", ...opt });
  c.header("set-cookie", cookie, { append: true });
};
var deleteCookie = (c, name, opt) => {
  setCookie(c, name, "", { ...opt, maxAge: 0 });
};
export {
  deleteCookie,
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie
};
