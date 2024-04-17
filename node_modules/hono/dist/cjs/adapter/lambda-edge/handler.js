"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var handler_exports = {};
__export(handler_exports, {
  handle: () => handle,
  isContentTypeBinary: () => isContentTypeBinary
});
module.exports = __toCommonJS(handler_exports);
var import_crypto = __toESM(require("crypto"), 1);
var import_encode = require("../../utils/encode");
globalThis.crypto ?? (globalThis.crypto = import_crypto.default);
const convertHeaders = (headers) => {
  const cfHeaders = {};
  headers.forEach((value, key) => {
    cfHeaders[key.toLowerCase()] = [{ key: key.toLowerCase(), value }];
  });
  return cfHeaders;
};
const handle = (app) => {
  return async (event, context, callback) => {
    const res = await app.fetch(createRequest(event), {
      event,
      context,
      callback: (err, result) => {
        callback?.(err, result);
      },
      config: event.Records[0].cf.config,
      request: event.Records[0].cf.request,
      response: event.Records[0].cf.response
    });
    return createResult(res);
  };
};
const createResult = async (res) => {
  const isBase64Encoded = isContentTypeBinary(res.headers.get("content-type") || "");
  const body = isBase64Encoded ? (0, import_encode.encodeBase64)(await res.arrayBuffer()) : await res.text();
  return {
    status: res.status.toString(),
    headers: convertHeaders(res.headers),
    body,
    ...isBase64Encoded ? { bodyEncoding: "base64" } : {}
  };
};
const createRequest = (event) => {
  const queryString = event.Records[0].cf.request.querystring;
  const urlPath = `https://${event.Records[0].cf.config.distributionDomainName}${event.Records[0].cf.request.uri}`;
  const url = queryString ? `${urlPath}?${queryString}` : urlPath;
  const headers = new Headers();
  Object.entries(event.Records[0].cf.request.headers).forEach(([k, v]) => {
    v.forEach((header) => headers.set(k, header.value));
  });
  const requestBody = event.Records[0].cf.request.body;
  const body = requestBody?.encoding === "base64" && requestBody?.data ? Buffer.from(requestBody.data, "base64") : requestBody?.data;
  return new Request(url, {
    headers,
    method: event.Records[0].cf.request.method,
    body
  });
};
const isContentTypeBinary = (contentType) => {
  return !/^(text\/(plain|html|css|javascript|csv).*|application\/(.*json|.*xml).*|image\/svg\+xml.*)$/.test(
    contentType
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handle,
  isContentTypeBinary
});
