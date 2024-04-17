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
  isContentEncodingBinary: () => isContentEncodingBinary,
  isContentTypeBinary: () => isContentTypeBinary,
  streamHandle: () => streamHandle
});
module.exports = __toCommonJS(handler_exports);
var import_crypto = __toESM(require("crypto"), 1);
var import_encode = require("../../utils/encode");
globalThis.crypto ?? (globalThis.crypto = import_crypto.default);
const getRequestContext = (event) => {
  return event.requestContext;
};
const streamToNodeStream = async (reader, writer) => {
  let readResult = await reader.read();
  while (!readResult.done) {
    writer.write(readResult.value);
    readResult = await reader.read();
  }
  writer.end();
};
const streamHandle = (app) => {
  return awslambda.streamifyResponse(
    async (event, responseStream, context) => {
      try {
        const req = createRequest(event);
        const requestContext = getRequestContext(event);
        const res = await app.fetch(req, {
          event,
          requestContext,
          context
        });
        const httpResponseMetadata = {
          statusCode: res.status,
          headers: Object.fromEntries(res.headers.entries())
        };
        if (res.body) {
          await streamToNodeStream(
            res.body.getReader(),
            awslambda.HttpResponseStream.from(responseStream, httpResponseMetadata)
          );
        }
      } catch (error) {
        console.error("Error processing request:", error);
        responseStream.write("Internal Server Error");
      } finally {
        responseStream.end();
      }
    }
  );
};
const handle = (app) => {
  return async (event, lambdaContext) => {
    const req = createRequest(event);
    const requestContext = getRequestContext(event);
    const res = await app.fetch(req, {
      event,
      requestContext,
      lambdaContext
    });
    return createResult(event, res);
  };
};
const createResult = async (event, res) => {
  const contentType = res.headers.get("content-type");
  let isBase64Encoded = contentType && isContentTypeBinary(contentType) ? true : false;
  if (!isBase64Encoded) {
    const contentEncoding = res.headers.get("content-encoding");
    isBase64Encoded = isContentEncodingBinary(contentEncoding);
  }
  const body = isBase64Encoded ? (0, import_encode.encodeBase64)(await res.arrayBuffer()) : await res.text();
  const result = {
    body,
    headers: {},
    statusCode: res.status,
    isBase64Encoded
  };
  setCookies(event, res, result);
  res.headers.forEach((value, key) => {
    result.headers[key] = value;
  });
  return result;
};
const createRequest = (event) => {
  const queryString = extractQueryString(event);
  const domainName = event.requestContext && "domainName" in event.requestContext ? event.requestContext.domainName : event.headers["host"];
  const path = isProxyEventV2(event) ? event.rawPath : event.path;
  const urlPath = `https://${domainName}${path}`;
  const url = queryString ? `${urlPath}?${queryString}` : urlPath;
  const headers = new Headers();
  getCookies(event, headers);
  for (const [k, v] of Object.entries(event.headers)) {
    if (v) {
      headers.set(k, v);
    }
  }
  const method = isProxyEventV2(event) ? event.requestContext.http.method : event.httpMethod;
  const requestInit = {
    headers,
    method
  };
  if (event.body) {
    requestInit.body = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;
  }
  return new Request(url, requestInit);
};
const extractQueryString = (event) => {
  return isProxyEventV2(event) ? event.rawQueryString : Object.entries(event.queryStringParameters || {}).filter(([, value]) => value).map(([key, value]) => `${key}=${value}`).join("&");
};
const getCookies = (event, headers) => {
  if (isProxyEventV2(event) && Array.isArray(event.cookies)) {
    headers.set("Cookie", event.cookies.join("; "));
  }
};
const setCookies = (event, res, result) => {
  if (res.headers.has("set-cookie")) {
    const cookies = res.headers.get("set-cookie")?.split(", ");
    if (Array.isArray(cookies)) {
      if (isProxyEventV2(event)) {
        result.cookies = cookies;
      } else {
        result.multiValueHeaders = {
          "set-cookie": cookies
        };
      }
      res.headers.delete("set-cookie");
    }
  }
};
const isProxyEventV2 = (event) => {
  return Object.prototype.hasOwnProperty.call(event, "rawPath");
};
const isContentTypeBinary = (contentType) => {
  return !/^(text\/(plain|html|css|javascript|csv).*|application\/(.*json|.*xml).*|image\/svg\+xml.*)$/.test(
    contentType
  );
};
const isContentEncodingBinary = (contentEncoding) => {
  if (contentEncoding === null) {
    return false;
  }
  return /^(gzip|deflate|compress|br)/.test(contentEncoding);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handle,
  isContentEncodingBinary,
  isContentTypeBinary,
  streamHandle
});
