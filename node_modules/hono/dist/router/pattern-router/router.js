// src/router/pattern-router/router.ts
import { METHOD_NAME_ALL, UnsupportedPathError } from "../../router.js";
var PatternRouter = class {
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
      throw new UnsupportedPathError();
    }
    this.routes.push([re, method, handler]);
  }
  match(method, path) {
    const handlers = [];
    for (const [pattern, routeMethod, handler] of this.routes) {
      if (routeMethod === METHOD_NAME_ALL || routeMethod === method) {
        const match = pattern.exec(path);
        if (match) {
          handlers.push([handler, match.groups || {}]);
        }
      }
    }
    return [handlers];
  }
};
export {
  PatternRouter
};
