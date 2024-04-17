// src/jsx/jsx-dev-runtime.ts
import { jsx } from "./index.js";
import { Fragment } from "./index.js";
function jsxDEV(tag, props) {
  if (!props || !("children" in props)) {
    return jsx(tag, props);
  }
  const children = props.children;
  delete props["children"];
  return Array.isArray(children) ? jsx(tag, props, ...children) : jsx(tag, props, children);
}
export {
  Fragment,
  jsxDEV
};
