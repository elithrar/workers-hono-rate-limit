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
var jsx_renderer_exports = {};
__export(jsx_renderer_exports, {
  RequestContext: () => RequestContext,
  jsxRenderer: () => jsxRenderer,
  useRequestContext: () => useRequestContext
});
module.exports = __toCommonJS(jsx_renderer_exports);
var import_html = require("../../helper/html");
var import_jsx = require("../../jsx");
var import_streaming = require("../../jsx/streaming");
const RequestContext = (0, import_jsx.createContext)(null);
const createRenderer = (c, component, options) => (children, props) => {
  const docType = typeof options?.docType === "string" ? options.docType : options?.docType === true ? "<!DOCTYPE html>" : "";
  const body = import_html.html`${(0, import_html.raw)(docType)}${(0, import_jsx.jsx)(
    RequestContext.Provider,
    { value: c },
    component ? component({ children, ...props || {} }) : children
  )}`;
  if (options?.stream) {
    return c.body((0, import_streaming.renderToReadableStream)(body), {
      headers: options.stream === true ? {
        "Transfer-Encoding": "chunked",
        "Content-Type": "text/html; charset=UTF-8"
      } : options.stream
    });
  } else {
    return c.html(body);
  }
};
const jsxRenderer = (component, options) => function jsxRenderer2(c, next) {
  c.setRenderer(createRenderer(c, component, options));
  return next();
};
const useRequestContext = () => {
  const c = (0, import_jsx.useContext)(RequestContext);
  if (!c) {
    throw new Error("RequestContext is not provided.");
  }
  return c;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RequestContext,
  jsxRenderer,
  useRequestContext
});
