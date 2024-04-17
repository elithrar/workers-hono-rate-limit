// src/middleware/jsx-renderer/index.ts
import { html, raw } from "../../helper/html/index.js";
import { jsx, createContext, useContext } from "../../jsx/index.js";
import { renderToReadableStream } from "../../jsx/streaming.js";
var RequestContext = createContext(null);
var createRenderer = (c, component, options) => (children, props) => {
  const docType = typeof options?.docType === "string" ? options.docType : options?.docType === true ? "<!DOCTYPE html>" : "";
  const body = html`${raw(docType)}${jsx(
    RequestContext.Provider,
    { value: c },
    component ? component({ children, ...props || {} }) : children
  )}`;
  if (options?.stream) {
    return c.body(renderToReadableStream(body), {
      headers: options.stream === true ? {
        "Transfer-Encoding": "chunked",
        "Content-Type": "text/html; charset=UTF-8"
      } : options.stream
    });
  } else {
    return c.html(body);
  }
};
var jsxRenderer = (component, options) => function jsxRenderer2(c, next) {
  c.setRenderer(createRenderer(c, component, options));
  return next();
};
var useRequestContext = () => {
  const c = useContext(RequestContext);
  if (!c) {
    throw new Error("RequestContext is not provided.");
  }
  return c;
};
export {
  RequestContext,
  jsxRenderer,
  useRequestContext
};
