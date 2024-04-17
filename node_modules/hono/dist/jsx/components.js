// src/jsx/components.ts
import { raw } from "../helper/html/index.js";
import {
  HtmlEscapedCallbackPhase,
  resolveCallback
} from "../utils/html.js";
var errorBoundaryCounter = 0;
var childrenToString = async (children) => {
  try {
    return children.map((c) => c.toString());
  } catch (e) {
    if (e instanceof Promise) {
      await e;
      return childrenToString(children);
    } else {
      throw e;
    }
  }
};
var ErrorBoundary = async ({ children, fallback, fallbackRender, onError }) => {
  if (!children) {
    return raw("");
  }
  if (!Array.isArray(children)) {
    children = [children];
  }
  let fallbackStr;
  const fallbackRes = (error) => {
    onError?.(error);
    return (fallbackStr || fallbackRender?.(error) || "").toString();
  };
  let resArray = [];
  try {
    resArray = children.map((c) => c.toString());
  } catch (e) {
    fallbackStr = await fallback?.toString();
    if (e instanceof Promise) {
      resArray = [
        e.then(() => childrenToString(children)).catch((e2) => fallbackRes(e2))
      ];
    } else {
      resArray = [fallbackRes(e)];
    }
  }
  if (resArray.some((res) => res instanceof Promise)) {
    fallbackStr || (fallbackStr = await fallback?.toString());
    const index = errorBoundaryCounter++;
    const replaceRe = RegExp(`(<template id="E:${index}"></template>.*?)(.*?)(<!--E:${index}-->)`);
    const caught = false;
    const catchCallback = ({ error, buffer }) => {
      if (caught) {
        return "";
      }
      const fallbackResString = fallbackRes(error);
      if (buffer) {
        buffer[0] = buffer[0].replace(replaceRe, fallbackResString);
      }
      return buffer ? "" : `<template>${fallbackResString}</template><script>
((d,c,n) => {
c=d.currentScript.previousSibling
d=d.getElementById('E:${index}')
if(!d)return
do{n=d.nextSibling;n.remove()}while(n.nodeType!=8||n.nodeValue!='E:${index}')
d.replaceWith(c.content)
})(document)
<\/script>`;
    };
    return raw(`<template id="E:${index}"></template><!--E:${index}-->`, [
      ({ phase, buffer, context }) => {
        if (phase === HtmlEscapedCallbackPhase.BeforeStream) {
          return;
        }
        return Promise.all(resArray).then(async (htmlArray) => {
          htmlArray = htmlArray.flat();
          const content = htmlArray.join("");
          let html = buffer ? "" : `<template>${content}</template><script>
((d,c) => {
c=d.currentScript.previousSibling
d=d.getElementById('E:${index}')
if(!d)return
d.parentElement.insertBefore(c.content,d.nextSibling)
})(document)
<\/script>`;
          if (htmlArray.every((html2) => !html2.callbacks?.length)) {
            if (buffer) {
              buffer[0] = buffer[0].replace(replaceRe, content);
            }
            return html;
          }
          if (buffer) {
            buffer[0] = buffer[0].replace(
              replaceRe,
              (_all, pre, _, post) => `${pre}${content}${post}`
            );
          }
          const callbacks = htmlArray.map((html2) => html2.callbacks || []).flat();
          if (phase === HtmlEscapedCallbackPhase.Stream) {
            html = await resolveCallback(
              html,
              HtmlEscapedCallbackPhase.BeforeStream,
              true,
              context
            );
          }
          let resolvedCount = 0;
          const promises = callbacks.map(
            (c) => (...args) => c(...args)?.then((content2) => {
              resolvedCount++;
              if (buffer) {
                if (resolvedCount === callbacks.length) {
                  buffer[0] = buffer[0].replace(replaceRe, (_all, _pre, content3) => content3);
                }
                buffer[0] += content2;
                return raw("", content2.callbacks);
              }
              return raw(
                content2 + (resolvedCount !== callbacks.length ? "" : `<script>
((d,c,n) => {
d=d.getElementById('E:${index}')
if(!d)return
n=d.nextSibling
do{n=n.nextSibling}while(n.nodeType!=8||n.nodeValue!='E:${index}')
n.remove()
d.remove()
})(document)
<\/script>`),
                content2.callbacks
              );
            }).catch((error) => catchCallback({ error, buffer }))
          );
          return raw(html, promises);
        }).catch((error) => catchCallback({ error, buffer }));
      }
    ]);
  } else {
    return raw(resArray.join(""));
  }
};
export {
  ErrorBoundary,
  childrenToString
};
