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
var sse_exports = {};
__export(sse_exports, {
  SSEStreamingApi: () => SSEStreamingApi,
  streamSSE: () => streamSSE
});
module.exports = __toCommonJS(sse_exports);
var import_stream = require("../../utils/stream");
class SSEStreamingApi extends import_stream.StreamingApi {
  constructor(writable, readable) {
    super(writable, readable);
  }
  async writeSSE(message) {
    const data = message.data.split("\n").map((line) => {
      return `data: ${line}`;
    }).join("\n");
    const sseData = [message.event && `event: ${message.event}`, data, message.id && `id: ${message.id}`].filter(Boolean).join("\n") + "\n\n";
    await this.write(sseData);
  }
}
const setSSEHeaders = (context) => {
  context.header("Transfer-Encoding", "chunked");
  context.header("Content-Type", "text/event-stream");
  context.header("Cache-Control", "no-cache");
  context.header("Connection", "keep-alive");
};
const streamSSE = (c, cb) => {
  const { readable, writable } = new TransformStream();
  const stream = new SSEStreamingApi(writable, readable);
  cb(stream).finally(() => stream.close());
  setSSEHeaders(c);
  return c.newResponse(stream.responseReadable);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SSEStreamingApi,
  streamSSE
});
