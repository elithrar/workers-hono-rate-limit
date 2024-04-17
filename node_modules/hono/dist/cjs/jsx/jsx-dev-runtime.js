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
var jsx_dev_runtime_exports = {};
__export(jsx_dev_runtime_exports, {
  Fragment: () => import__2.Fragment,
  jsxDEV: () => jsxDEV
});
module.exports = __toCommonJS(jsx_dev_runtime_exports);
var import__ = require(".");
var import__2 = require(".");
function jsxDEV(tag, props) {
  if (!props || !("children" in props)) {
    return (0, import__.jsx)(tag, props);
  }
  const children = props.children;
  delete props["children"];
  return Array.isArray(children) ? (0, import__.jsx)(tag, props, ...children) : (0, import__.jsx)(tag, props, children);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Fragment,
  jsxDEV
});
