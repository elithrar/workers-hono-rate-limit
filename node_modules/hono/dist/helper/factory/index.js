// src/helper/factory/index.ts
var Factory = class {
  constructor() {
    this.createMiddleware = (middleware) => middleware;
  }
  createHandlers(...handlers) {
    return handlers.filter((handler) => handler !== void 0);
  }
};
var createFactory = () => new Factory();
var createMiddleware = (middleware) => createFactory().createMiddleware(middleware);
export {
  Factory,
  createFactory,
  createMiddleware
};
