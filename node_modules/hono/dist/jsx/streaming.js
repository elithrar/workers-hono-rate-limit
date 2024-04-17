// src/jsx/streaming.ts
import { raw } from "../helper/html/index.js";
import { HtmlEscapedCallbackPhase, resolveCallback } from "../utils/html.js";
import { childrenToString } from "./components.js";
var suspenseCounter = 0;
var Suspense = async ({ children, fallback }) => {
  if (!children) {
    return fallback.toString();
  }
  if (!Array.isArray(children)) {
    children = [children];
  }
  let resArray = [];
  try {
    resArray = children.map((c) => c.toString());
  } catch (e) {
    if (e instanceof Promise) {
      resArray = [e.then(() => childrenToString(children))];
    } else {
      throw e;
    }
  }
  if (resArray.some((res) => res instanceof Promise)) {
    const index = suspenseCounter++;
    const fallbackStr = await fallback.toString();
    return raw(`<template id="H:${index}"></template>${fallbackStr}<!--/$-->`, [
      ...fallbackStr.callbacks || [],
      ({ phase, buffer, context }) => {
        if (phase === HtmlEscapedCallbackPhase.BeforeStream) {
          return;
        }
        return Promise.all(resArray).then(async (htmlArray) => {
          htmlArray = htmlArray.flat();
          const content = htmlArray.join("");
          if (buffer) {
            buffer[0] = buffer[0].replace(
              new RegExp(`<template id="H:${index}"></template>.*?<!--/\\$-->`),
              content
            );
          }
          let html = buffer ? "" : `<template>${content}</template><script>
((d,c,n) => {
c=d.currentScript.previousSibling
d=d.getElementById('H:${index}')
if(!d)return
do{n=d.nextSibling;n.remove()}while(n.nodeType!=8||n.nodeValue!='/$')
d.replaceWith(c.content)
})(document)
<\/script>`;
          const callbacks = htmlArray.map((html2) => html2.callbacks || []).flat();
          if (!callbacks.length) {
            return html;
          }
          if (phase === HtmlEscapedCallbackPhase.Stream) {
            html = await resolveCallback(html, HtmlEscapedCallbackPhase.BeforeStream, true, context);
          }
          return raw(html, callbacks);
        });
      }
    ]);
  } else {
    return raw(resArray.join(""));
  }
};
var textEncoder = new TextEncoder();
var renderToReadableStream = (str) => {
  const reader = new ReadableStream({
    async start(controller) {
      const tmp = str instanceof Promise ? await str : await str.toString();
      const context = typeof tmp === "object" ? tmp : {};
      const resolved = await resolveCallback(
        tmp,
        HtmlEscapedCallbackPhase.BeforeStream,
        true,
        context
      );
      controller.enqueue(textEncoder.encode(resolved));
      let resolvedCount = 0;
      const callbacks = [];
      const then = (promise) => {
        callbacks.push(
          promise.catch((err) => {
            console.trace(err);
            return "";
          }).then(async (res) => {
            res = await resolveCallback(res, HtmlEscapedCallbackPhase.BeforeStream, true, context);
            res.callbacks?.map((c) => c({ phase: HtmlEscapedCallbackPhase.Stream, context })).filter(Boolean).forEach(then);
            resolvedCount++;
            controller.enqueue(textEncoder.encode(res));
          })
        );
      };
      resolved.callbacks?.map((c) => c({ phase: HtmlEscapedCallbackPhase.Stream, context })).filter(Boolean).forEach(then);
      while (resolvedCount !== callbacks.length) {
        await Promise.all(callbacks);
      }
      controller.close();
    }
  });
  return reader;
};
export {
  Suspense,
  renderToReadableStream
};
