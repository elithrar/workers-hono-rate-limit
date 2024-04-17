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
var jsx_exports = {};
__export(jsx_exports, {
  ErrorBoundary: () => import_components.ErrorBoundary,
  Fragment: () => Fragment,
  JSXNode: () => JSXNode,
  createContext: () => createContext,
  jsx: () => jsxFn,
  memo: () => memo,
  useContext: () => useContext
});
module.exports = __toCommonJS(jsx_exports);
var import_html = require("../helper/html");
var import_html2 = require("../utils/html");
var import_components = require("./components");
const emptyTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
const booleanAttributes = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
];
const childrenToStringToBuffer = (children, buffer) => {
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];
    if (typeof child === "string") {
      (0, import_html2.escapeToBuffer)(child, buffer);
    } else if (typeof child === "boolean" || child === null || child === void 0) {
      continue;
    } else if (child instanceof JSXNode) {
      child.toStringToBuffer(buffer);
    } else if (typeof child === "number" || child.isEscaped) {
      ;
      buffer[0] += child;
    } else if (child instanceof Promise) {
      buffer.unshift("", child);
    } else {
      childrenToStringToBuffer(child, buffer);
    }
  }
};
class JSXNode {
  constructor(tag, props, children) {
    this.isEscaped = true;
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
  toString() {
    const buffer = [""];
    this.localContexts?.forEach(([context, value]) => {
      context.values.push(value);
    });
    try {
      this.toStringToBuffer(buffer);
    } finally {
      this.localContexts?.forEach(([context]) => {
        context.values.pop();
      });
    }
    return buffer.length === 1 ? buffer[0] : (0, import_html2.stringBufferToString)(buffer);
  }
  toStringToBuffer(buffer) {
    const tag = this.tag;
    const props = this.props;
    let { children } = this;
    buffer[0] += `<${tag}`;
    const propsKeys = Object.keys(props || {});
    for (let i = 0, len = propsKeys.length; i < len; i++) {
      const key = propsKeys[i];
      const v = props[key];
      if (key === "style" && typeof v === "object") {
        const styles = Object.keys(v).map((k) => {
          const property = k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
          return `${property}:${v[k]}`;
        }).join(";");
        buffer[0] += ` style="${styles}"`;
      } else if (typeof v === "string") {
        buffer[0] += ` ${key}="`;
        (0, import_html2.escapeToBuffer)(v, buffer);
        buffer[0] += '"';
      } else if (v === null || v === void 0) {
      } else if (typeof v === "number" || v.isEscaped) {
        buffer[0] += ` ${key}="${v}"`;
      } else if (typeof v === "boolean" && booleanAttributes.includes(key)) {
        if (v) {
          buffer[0] += ` ${key}=""`;
        }
      } else if (key === "dangerouslySetInnerHTML") {
        if (children.length > 0) {
          throw "Can only set one of `children` or `props.dangerouslySetInnerHTML`.";
        }
        children = [(0, import_html.raw)(v.__html)];
      } else if (v instanceof Promise) {
        buffer[0] += ` ${key}="`;
        buffer.unshift('"', v);
      } else {
        buffer[0] += ` ${key}="`;
        (0, import_html2.escapeToBuffer)(v.toString(), buffer);
        buffer[0] += '"';
      }
    }
    if (emptyTags.includes(tag)) {
      buffer[0] += "/>";
      return;
    }
    buffer[0] += ">";
    childrenToStringToBuffer(children, buffer);
    buffer[0] += `</${tag}>`;
  }
}
class JSXFunctionNode extends JSXNode {
  toStringToBuffer(buffer) {
    const { children } = this;
    const res = this.tag.call(null, {
      ...this.props,
      children: children.length <= 1 ? children[0] : children
    });
    if (res instanceof Promise) {
      if (globalContexts.length === 0) {
        buffer.unshift("", res);
      } else {
        const currentContexts = globalContexts.map((c) => [
          c,
          c.values[c.values.length - 1]
        ]);
        buffer.unshift(
          "",
          res.then((childRes) => {
            if (childRes instanceof JSXNode) {
              childRes.localContexts = currentContexts;
            }
            return childRes;
          })
        );
      }
    } else if (res instanceof JSXNode) {
      res.toStringToBuffer(buffer);
    } else if (typeof res === "number" || res.isEscaped) {
      buffer[0] += res;
    } else {
      (0, import_html2.escapeToBuffer)(res, buffer);
    }
  }
}
class JSXFragmentNode extends JSXNode {
  toStringToBuffer(buffer) {
    childrenToStringToBuffer(this.children, buffer);
  }
}
const jsxFn = (tag, props, ...children) => {
  if (typeof tag === "function") {
    return new JSXFunctionNode(tag, props, children);
  } else {
    return new JSXNode(tag, props, children);
  }
};
const shallowEqual = (a, b) => {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  for (let i = 0, len = aKeys.length; i < len; i++) {
    if (a[aKeys[i]] !== b[aKeys[i]]) {
      return false;
    }
  }
  return true;
};
const memo = (component, propsAreEqual = shallowEqual) => {
  let computed = void 0;
  let prevProps = void 0;
  return (props) => {
    if (prevProps && !propsAreEqual(prevProps, props)) {
      computed = void 0;
    }
    prevProps = props;
    return computed || (computed = component(props));
  };
};
const Fragment = (props) => {
  return new JSXFragmentNode("", {}, props.children ? [props.children] : []);
};
const globalContexts = [];
const createContext = (defaultValue) => {
  const values = [defaultValue];
  const context = {
    values,
    Provider(props) {
      values.push(props.value);
      let string;
      try {
        string = props.children ? (Array.isArray(props.children) ? new JSXFragmentNode("", {}, props.children) : props.children).toString() : "";
      } finally {
        values.pop();
      }
      if (string instanceof Promise) {
        return string.then(
          (resString) => (0, import_html.raw)(resString, resString.callbacks)
        );
      } else {
        return (0, import_html.raw)(string);
      }
    }
  };
  globalContexts.push(context);
  return context;
};
const useContext = (context) => {
  return context.values[context.values.length - 1];
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorBoundary,
  Fragment,
  JSXNode,
  createContext,
  jsx,
  memo,
  useContext
});
