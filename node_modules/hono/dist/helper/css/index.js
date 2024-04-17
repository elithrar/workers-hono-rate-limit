// src/helper/css/index.ts
import { raw } from "../../helper/html/index.js";
var IS_CSS_CLASS_NAME = Symbol("IS_CSS_CLASS_NAME");
var STYLE_STRING = Symbol("STYLE_STRING");
var SELECTORS = Symbol("SELECTORS");
var EXTERNAL_CLASS_NAMES = Symbol("EXTERNAL_CLASS_NAMES");
var rawCssString = (value) => {
  const escapedString = new String(value);
  escapedString.isCssEscaped = true;
  return escapedString;
};
var DEFAULT_STYLE_ID = "hono-css";
var toHash = (str) => {
  let i = 0, out = 11;
  while (i < str.length) {
    out = 101 * out + str.charCodeAt(i++) >>> 0;
  }
  return "css-" + out;
};
var cssStringReStr = [
  '"(?:(?:\\\\[\\s\\S]|[^"\\\\])*)"',
  "'(?:(?:\\\\[\\s\\S]|[^'\\\\])*)'"
].join("|");
var minifyCssRe = new RegExp(
  [
    "(" + cssStringReStr + ")",
    "(?:" + [
      "^\\s+",
      "\\/\\*.*?\\*\\/\\s*",
      "\\/\\/.*\\n\\s*",
      "\\s+$"
    ].join("|") + ")",
    ";\\s*(}|$)\\s*",
    "\\s*([{};:,])\\s*",
    "(\\s)\\s+"
  ].join("|"),
  "g"
);
var minify = (css2) => {
  return css2.replace(minifyCssRe, (_, $1, $2, $3, $4) => $1 || $2 || $3 || $4 || "");
};
var buildStyleString = async (strings, values, selectors, externalClassNames) => {
  let styleString = "";
  for (let i = 0; i < strings.length; i++) {
    styleString += strings[i];
    let vArray = values[i];
    if (typeof vArray === "boolean" || vArray === null || vArray === void 0) {
      continue;
    }
    if (!Array.isArray(vArray)) {
      vArray = [vArray];
    }
    for (let j = 0; j < vArray.length; j++) {
      let value = vArray[j] instanceof Promise ? await vArray[j] : vArray[j];
      if (typeof value === "boolean" || value === null || value === void 0) {
        continue;
      }
      if (typeof value === "number") {
        styleString += value;
      } else if (value.startsWith("@keyframes ")) {
        selectors.push(value);
        styleString += ` ${value.substring(11)} `;
      } else {
        if (value[IS_CSS_CLASS_NAME]) {
          selectors.push(...value[SELECTORS]);
          externalClassNames.push(...value[EXTERNAL_CLASS_NAMES]);
          value = value[STYLE_STRING];
          if (value.length > 0) {
            const lastChar = value[value.length - 1];
            if (lastChar !== ";" && lastChar !== "}") {
              value += ";";
            }
          }
        } else if (!value.isCssEscaped && /([\\"'\/])/.test(value)) {
          value = value.replace(/([\\"']|(?<=<)\/)/g, "\\$1");
        }
        styleString += `${value || ""}`;
      }
    }
  }
  return minify(styleString);
};
var createCssContext = ({ id }) => {
  const contextMap = /* @__PURE__ */ new WeakMap();
  const replaceStyleRe = new RegExp(`(<style id="${id}">.*?)(</style>)`);
  const css2 = async (strings, ...values) => {
    const selectors = [];
    const externalClassNames = [];
    const thisStyleString = await buildStyleString(strings, values, selectors, externalClassNames);
    const thisSelector = toHash(thisStyleString);
    const className = new String([thisSelector, ...externalClassNames].join(" "));
    const appendStyle = ({ buffer, context }) => {
      const [toAdd, added] = contextMap.get(context);
      const names = Object.keys(toAdd);
      if (!names.length) {
        return;
      }
      let stylesStr = "";
      names.forEach((className2) => {
        added[className2] = true;
        stylesStr += `${className2[0] === "@" ? "" : "."}${className2}{${toAdd[className2]}}`;
      });
      contextMap.set(context, [{}, added]);
      if (buffer && replaceStyleRe.test(buffer[0])) {
        buffer[0] = buffer[0].replace(replaceStyleRe, (_, pre, post) => `${pre}${stylesStr}${post}`);
        return;
      }
      const appendStyleScript = `<script>document.querySelector('#${id}').textContent+=${JSON.stringify(
        stylesStr
      )}<\/script>`;
      if (buffer) {
        buffer[0] = `${appendStyleScript}${buffer[0]}`;
        return;
      }
      return Promise.resolve(appendStyleScript);
    };
    const addClassNameToContext = ({ context }) => {
      if (!contextMap.get(context)) {
        contextMap.set(context, [{}, {}]);
      }
      const [toAdd, added] = contextMap.get(context);
      let allAdded = true;
      if (!added[thisSelector]) {
        allAdded = false;
        toAdd[thisSelector] = thisStyleString;
      }
      selectors.forEach((className2) => {
        if (!added[`${className2}`]) {
          allAdded = false;
          toAdd[`${className2}`] = className2[STYLE_STRING];
        }
      });
      if (allAdded) {
        return;
      }
      return Promise.resolve(raw("", [appendStyle]));
    };
    Object.assign(className, {
      isEscaped: true,
      callbacks: [addClassNameToContext],
      [IS_CSS_CLASS_NAME]: true,
      [STYLE_STRING]: thisStyleString,
      [SELECTORS]: selectors,
      [EXTERNAL_CLASS_NAMES]: externalClassNames
    });
    return className;
  };
  const cx2 = async (...args) => {
    const resolvedArgs = await Promise.all(args);
    for (let i = 0; i < resolvedArgs.length; i++) {
      const arg = resolvedArgs[i];
      if (typeof arg === "string" && !arg[IS_CSS_CLASS_NAME]) {
        const externalClassName = new String(arg);
        resolvedArgs[i] = Object.assign(externalClassName, {
          isEscaped: true,
          [IS_CSS_CLASS_NAME]: true,
          [STYLE_STRING]: "",
          [SELECTORS]: [],
          [EXTERNAL_CLASS_NAMES]: [arg]
        });
      }
    }
    return css2(Array(resolvedArgs.length).fill(""), ...resolvedArgs);
  };
  const keyframes2 = async (strings, ...values) => {
    const styleString = await buildStyleString(strings, values, [], []);
    const className = new String(`@keyframes ${toHash(styleString)}`);
    Object.assign(className, {
      isEscaped: true,
      [IS_CSS_CLASS_NAME]: true,
      [STYLE_STRING]: styleString,
      [SELECTORS]: [],
      [EXTERNAL_CLASS_NAMES]: []
    });
    return className;
  };
  const Style2 = () => raw(`<style id="${id}"></style>`);
  return {
    css: css2,
    cx: cx2,
    keyframes: keyframes2,
    Style: Style2
  };
};
var defaultContext = createCssContext({ id: DEFAULT_STYLE_ID });
var css = defaultContext.css;
var cx = defaultContext.cx;
var keyframes = defaultContext.keyframes;
var Style = defaultContext.Style;
export {
  Style,
  createCssContext,
  css,
  cx,
  keyframes,
  rawCssString
};
