// src/helper/adapter/index.ts
var env = (c, runtime) => {
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
var getRuntimeKey = () => {
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
export {
  env,
  getRuntimeKey
};
