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
var utils_exports = {};
__export(utils_exports, {
  deepMerge: () => deepMerge,
  mergePath: () => mergePath,
  removeIndexString: () => removeIndexString,
  replaceUrlParam: () => replaceUrlParam
});
module.exports = __toCommonJS(utils_exports);
const mergePath = (base, path) => {
  base = base.replace(/\/+$/, "");
  base = base + "/";
  path = path.replace(/^\/+/, "");
  return base + path;
};
const replaceUrlParam = (urlString, params) => {
  for (const [k, v] of Object.entries(params)) {
    const reg = new RegExp("/:" + k + "({[^}]*})?");
    urlString = urlString.replace(reg, `/${v}`);
  }
  return urlString;
};
const removeIndexString = (urlSting) => {
  return urlSting.replace(/\/index$/, "/");
};
function isObject(item) {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}
function deepMerge(target, source) {
  if (!isObject(target) && !isObject(source)) {
    return source;
  }
  const merged = { ...target };
  for (const key in source) {
    const value = source[key];
    if (isObject(merged[key]) && isObject(value)) {
      merged[key] = deepMerge(merged[key], value);
    } else {
      merged[key] = value;
    }
  }
  return merged;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deepMerge,
  mergePath,
  removeIndexString,
  replaceUrlParam
});
