// src/adapter/lambda-edge/handler.ts
import crypto from "crypto";
import { encodeBase64 } from "../../utils/encode.js";
globalThis.crypto ?? (globalThis.crypto = crypto);
var convertHeaders = (headers) => {
  const cfHeaders = {};
  headers.forEach((value, key) => {
    cfHeaders[key.toLowerCase()] = [{ key: key.toLowerCase(), value }];
  });
  return cfHeaders;
};
var handle = (app) => {
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
var createResult = async (res) => {
  const isBase64Encoded = isContentTypeBinary(res.headers.get("content-type") || "");
  const body = isBase64Encoded ? encodeBase64(await res.arrayBuffer()) : await res.text();
  return {
    status: res.status.toString(),
    headers: convertHeaders(res.headers),
    body,
    ...isBase64Encoded ? { bodyEncoding: "base64" } : {}
  };
};
var createRequest = (event) => {
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
var isContentTypeBinary = (contentType) => {
  return !/^(text\/(plain|html|css|javascript|csv).*|application\/(.*json|.*xml).*|image\/svg\+xml.*)$/.test(
    contentType
  );
};
export {
  handle,
  isContentTypeBinary
};
