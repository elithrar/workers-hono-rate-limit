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
var adapter_exports = {};
__export(adapter_exports, {
  env: () => env,
  getRuntimeKey: () => getRuntimeKey
});
module.exports = __toCommonJS(adapter_exports);
const env = (c, runtime) => {
  const global = globalThis;
  const globalEnv = global?.process?.env;
  runtime ?? (runtime = getRuntimeKey());
  const runtimeEnvHandlers = {
    bun: () => globalEnv,
    node: () => globalEnv,
    "edge-light": () => globalEnv,
    lagon: () => globalEnv,
    deno: () => {
      return Deno.env.toObject();
    },
    workerd: () => c.env,
    fastly: () => ({}),
    other: () => ({})
  };
  return runtimeEnvHandlers[runtime]();
};
const getRuntimeKey = () => {
  const global = globalThis;
  if (global?.Deno !== void 0) {
    return "deno";
  }
  if (global?.Bun !== void 0) {
    return "bun";
  }
  if (typeof global?.WebSocketPair === "function") {
    return "workerd";
  }
  if (typeof global?.EdgeRuntime === "string") {
    return "edge-light";
  }
  if (global?.fastly !== void 0) {
    return "fastly";
  }
  if (global?.__lagon__ !== void 0) {
    return "lagon";
  }
  if (global?.process?.release?.name === "node") {
    return "node";
  }
  return "other";
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  env,
  getRuntimeKey
});
