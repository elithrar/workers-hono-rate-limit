// src/client/client.ts
import { serialize } from "../utils/cookie.js";
import { deepMerge, mergePath, removeIndexString, replaceUrlParam } from "./utils.js";
var createProxy = (callback, path) => {
  const proxy = new Proxy(() => {
  }, {
    get(_obj, key) {
      if (typeof key !== "string" || key === "then") {
        return void 0;
      }
      return createProxy(callback, [...path, key]);
    },
    apply(_1, _2, args) {
      return callback({
        path,
        args
      });
    }
  });
  return proxy;
};
var ClientRequestImpl = class {
  constructor(url, method) {
    this.queryParams = void 0;
    this.pathParams = {};
    this.cType = void 0;
    this.fetch = (args, opt) => {
      if (args) {
        if (args.query) {
          for (const [k, v] of Object.entries(args.query)) {
            if (v === void 0) {
              continue;
            }
            this.queryParams || (this.queryParams = new URLSearchParams());
            if (Array.isArray(v)) {
              for (const v2 of v) {
                this.queryParams.append(k, v2);
              }
            } else {
              this.queryParams.set(k, v);
            }
          }
        }
        if (args.queries) {
          for (const [k, v] of Object.entries(args.queries)) {
            for (const v2 of v) {
              this.queryParams || (this.queryParams = new URLSearchParams());
              this.queryParams.append(k, v2);
            }
          }
        }
        if (args.form) {
          const form = new FormData();
          for (const [k, v] of Object.entries(args.form)) {
            form.append(k, v);
          }
          this.rBody = form;
        }
        if (args.json) {
          this.rBody = JSON.stringify(args.json);
          this.cType = "application/json";
        }
        if (args.param) {
          this.pathParams = args.param;
        }
      }
      let methodUpperCase = this.method.toUpperCase();
      let setBody = !(methodUpperCase === "GET" || methodUpperCase === "HEAD");
      const headerValues = {
        ...args?.header ?? {},
        ...opt?.headers ? opt.headers : {}
      };
      if (args?.cookie) {
        const cookies = [];
        for (const [key, value] of Object.entries(args.cookie)) {
          cookies.push(serialize(key, value, { path: "/" }));
        }
        headerValues["Cookie"] = cookies.join(",");
      }
      if (this.cType) {
        headerValues["Content-Type"] = this.cType;
      }
      const headers = new Headers(headerValues ?? void 0);
      let url = this.url;
      url = removeIndexString(url);
      url = replaceUrlParam(url, this.pathParams);
      if (this.queryParams) {
        url = url + "?" + this.queryParams.toString();
      }
      methodUpperCase = this.method.toUpperCase();
      setBody = !(methodUpperCase === "GET" || methodUpperCase === "HEAD");
      return (opt?.fetch || fetch)(url, {
        body: setBody ? this.rBody : void 0,
        method: methodUpperCase,
        headers
      });
    };
    this.url = url;
    this.method = method;
  }
};
var hc = (baseUrl, options) => createProxy((opts) => {
  const parts = [...opts.path];
  let method = "";
  if (/^\$/.test(parts[parts.length - 1])) {
    const last = parts.pop();
    if (last) {
      method = last.replace(/^\$/, "");
    }
  }
  const path = parts.join("/");
  const url = mergePath(baseUrl, path);
  if (method === "url") {
    if (opts.args[0] && opts.args[0].param) {
      return new URL(replaceUrlParam(url, opts.args[0].param));
    }
    return new URL(url);
  }
  const req = new ClientRequestImpl(url, method);
  if (method) {
    options ?? (options = {});
    const args = deepMerge(options, { ...opts.args[1] ?? {} });
    return req.fetch(opts.args[0], args);
  }
  return req;
}, []);
export {
  hc
};
