// src/adapter/aws-lambda/handler.ts
import crypto from "crypto";
import { encodeBase64 } from "../../utils/encode.js";
globalThis.crypto ?? (globalThis.crypto = crypto);
var getRequestContext = (event) => {
  return event.requestContext;
};
var streamToNodeStream = async (reader, writer) => {
  let readResult = await reader.read();
  while (!readResult.done) {
    writer.write(readResult.value);
    readResult = await reader.read();
  }
  writer.end();
};
var streamHandle = (app) => {
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
var handle = (app) => {
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
var createResult = async (event, res) => {
  const contentType = res.headers.get("content-type");
  let isBase64Encoded = contentType && isContentTypeBinary(contentType) ? true : false;
  if (!isBase64Encoded) {
    const contentEncoding = res.headers.get("content-encoding");
    isBase64Encoded = isContentEncodingBinary(contentEncoding);
  }
  const body = isBase64Encoded ? encodeBase64(await res.arrayBuffer()) : await res.text();
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
var createRequest = (event) => {
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
var extractQueryString = (event) => {
  return isProxyEventV2(event) ? event.rawQueryString : Object.entries(event.queryStringParameters || {}).filter(([, value]) => value).map(([key, value]) => `${key}=${value}`).join("&");
};
var getCookies = (event, headers) => {
  if (isProxyEventV2(event) && Array.isArray(event.cookies)) {
    headers.set("Cookie", event.cookies.join("; "));
  }
};
var setCookies = (event, res, result) => {
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
var isProxyEventV2 = (event) => {
  return Object.prototype.hasOwnProperty.call(event, "rawPath");
};
var isContentTypeBinary = (contentType) => {
  return !/^(text\/(plain|html|css|javascript|csv).*|application\/(.*json|.*xml).*|image\/svg\+xml.*)$/.test(
    contentType
  );
};
var isContentEncodingBinary = (contentEncoding) => {
  if (contentEncoding === null) {
    return false;
  }
  return /^(gzip|deflate|compress|br)/.test(contentEncoding);
};
export {
  handle,
  isContentEncodingBinary,
  isContentTypeBinary,
  streamHandle
};
