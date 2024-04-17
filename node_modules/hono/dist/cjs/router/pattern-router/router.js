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
var router_exports = {};
__export(router_exports, {
  PatternRouter: () => PatternRouter
});
module.exports = __toCommonJS(router_exports);
var import_router = require("../../router");
class PatternRouter {
  constructor() {
    this.name = "PatternRouter";
    this.routes = [];
  }
  add(method, path, handler) {
    const endsWithWildcard = path[path.length - 1] === "*";
    if (endsWithWildcard) {
      path = path.slice(0, -2);
    }
    const parts = path.match(/\/?(:\w+(?:{[^}]+})?)|\/?[^\/\?]+|(\?)/g) || [];
    if (parts[parts.length - 1] === "?") {
      this.add(method, parts.slice(0, parts.length - 2).join(""), handler);
      parts.pop();
    }
    for (let i = 0, len = parts.length; i < len; i++) {
      const match = parts[i].match(/^\/:([^{]+)(?:{(.*)})?/);
      if (match) {
        parts[i] = `/(?<${match[1]}>${match[2] || "[^/]+"})`;
      } else if (parts[i] === "/*") {
        parts[i] = "/[^/]+";
      }
    }
    let re;
    try {
      re = new RegExp(`^${parts.join("")}${endsWithWildcard ? "" : "/?$"}`);
    } catch (e) {
      throw new import_router.UnsupportedPathError();
    }
    this.routes.push([re, method, handler]);
  }
  match(method, path) {
    const handlers = [];
    for (const [pattern, routeMethod, handler] of this.routes) {
      if (routeMethod === import_router.METHOD_NAME_ALL || routeMethod === method) {
        const match = pattern.exec(path);
        if (match) {
          handlers.push([handler, match.groups || {}]);
        }
      }
    }
    return [handlers];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PatternRouter
});
