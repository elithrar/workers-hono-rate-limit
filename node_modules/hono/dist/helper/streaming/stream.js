// src/helper/streaming/stream.ts
import { StreamingApi } from "../../utils/stream.js";
var stream = (c, cb) => {
  const { readable, writable } = new TransformStream();
  const stream2 = new StreamingApi(writable, readable);
  cb(stream2).finally(() => stream2.close());
  return c.newResponse(stream2.responseReadable);
};
export {
  stream
};
