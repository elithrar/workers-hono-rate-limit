// src/test-utils/setup-vitest.ts
import crypto from "node:crypto";
import { vi } from "vitest";
vi.stubGlobal("crypto", crypto);
var MockCache = class {
  constructor(name, store) {
    this.name = name;
    this.store = store;
  }
  async match(key) {
    return this.store.get(key) || null;
  }
  async put(key, response) {
    this.store.set(key, response);
  }
};
var globalStore = /* @__PURE__ */ new Map();
var caches = {
  open: (name) => {
    return new MockCache(name, globalStore);
  }
};
vi.stubGlobal("caches", caches);
