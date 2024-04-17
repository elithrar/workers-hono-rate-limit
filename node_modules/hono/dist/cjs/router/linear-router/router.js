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
  LinearRouter: () => LinearRouter
});
module.exports = __toCommonJS(router_exports);
var import_router = require("../../router");
var import_url = require("../../utils/url");
const emptyParams = {};
const splitPathRe = /\/(:\w+(?:{[^}]+})?)|\/[^\/\?]+|(\?)/g;
const splitByStarRe = /\*/;
class LinearRouter {
  constructor() {
    this.name = "LinearRouter";
    this.routes = [];
  }
  add(method, path, handler) {
    ;
    ((0, import_url.checkOptionalParameter)(path) || [path]).forEach((p) => {
      this.routes.push([method, p, handler]);
    });
  }
  match(method, path) {
    const handlers = [];
    ROUTES_LOOP:
      for (let i = 0; i < this.routes.length; i++) {
        const [routeMethod, routePath, handler] = this.routes[i];
        if (routeMethod !== method && routeMethod !== import_router.METHOD_NAME_ALL) {
          continue;
        }
        if (routePath === "*" || routePath === "/*") {
          handlers.push([handler, emptyParams]);
          continue;
        }
        const hasStar = routePath.indexOf("*") !== -1;
        const hasLabel = routePath.indexOf(":") !== -1;
        if (!hasStar && !hasLabel) {
          if (routePath === path || routePath + "/" === path) {
            handlers.push([handler, emptyParams]);
          }
        } else if (hasStar && !hasLabel) {
          const endsWithStar = routePath.charCodeAt(routePath.length - 1) === 42;
          const parts = (endsWithStar ? routePath.slice(0, -2) : routePath).split(splitByStarRe);
          const lastIndex = parts.length - 1;
          for (let j = 0, pos = 0; j < parts.length; j++) {
            const part = parts[j];
            const index = path.indexOf(part, pos);
            if (index !== pos) {
              continue ROUTES_LOOP;
            }
            pos += part.length;
            if (j === lastIndex) {
              if (!endsWithStar && pos !== path.length && !(pos === path.length - 1 && path.charCodeAt(pos) === 47)) {
                continue ROUTES_LOOP;
              }
            } else {
              const index2 = path.indexOf("/", pos);
              if (index2 === -1) {
                continue ROUTES_LOOP;
              }
              pos = index2;
            }
          }
          handlers.push([handler, emptyParams]);
        } else if (hasLabel && !hasStar) {
          const params = {};
          const parts = routePath.match(splitPathRe);
          const lastIndex = parts.length - 1;
          for (let j = 0, pos = 0; j < parts.length; j++) {
            if (pos === -1 || pos >= path.length) {
              continue ROUTES_LOOP;
            }
            const part = parts[j];
            if (part.charCodeAt(1) === 58) {
              let name = part.slice(2);
              let value;
              if (name.charCodeAt(name.length - 1) === 125) {
                const openBracePos = name.indexOf("{");
                const pattern = name.slice(openBracePos + 1, -1);
                const restPath = path.slice(pos + 1);
                const match = new RegExp(pattern, "d").exec(restPath);
                if (!match || match.indices[0][0] !== 0 || match.indices[0][1] === 0) {
                  continue ROUTES_LOOP;
                }
                name = name.slice(0, openBracePos);
                value = restPath.slice(...match.indices[0]);
                pos += match.indices[0][1] + 1;
              } else {
                let endValuePos = path.indexOf("/", pos + 1);
                if (endValuePos === -1) {
                  if (pos + 1 === path.length) {
                    continue ROUTES_LOOP;
                  }
                  endValuePos = path.length;
                }
                value = path.slice(pos + 1, endValuePos);
                pos = endValuePos;
              }
              params[name] || (params[name] = value);
            } else {
              const index = path.indexOf(part, pos);
              if (index !== pos) {
                continue ROUTES_LOOP;
              }
              pos += part.length;
            }
            if (j === lastIndex) {
              if (pos !== path.length && !(pos === path.length - 1 && path.charCodeAt(pos) === 47)) {
                continue ROUTES_LOOP;
              }
            }
          }
          handlers.push([handler, params]);
        } else if (hasLabel && hasStar) {
          throw new import_router.UnsupportedPathError();
        }
      }
    return [handlers];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LinearRouter
});
