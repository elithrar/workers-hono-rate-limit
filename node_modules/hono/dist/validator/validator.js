// src/validator/validator.ts
import { getCookie } from "../helper/cookie/index.js";
import { bufferToFormData } from "../utils/buffer.js";
var validator = (target, validationFunc) => {
  return async (c, next) => {
    let value = {};
    const contentType = c.req.header("Content-Type");
    switch (target) {
      case "json":
        if (!contentType || !contentType.startsWith("application/json")) {
          const message = `Invalid HTTP header: Content-Type=${contentType}`;
          console.error(message);
          return c.json(
            {
              success: false,
              message
            },
            400
          );
        }
        try {
          const arrayBuffer = c.req.bodyCache.arrayBuffer ?? await c.req.raw.arrayBuffer();
          value = await new Response(arrayBuffer).json();
          c.req.bodyCache.json = value;
          c.req.bodyCache.arrayBuffer = arrayBuffer;
        } catch {
          console.error("Error: Malformed JSON in request body");
          return c.json(
            {
              success: false,
              message: "Malformed JSON in request body"
            },
            400
          );
        }
        break;
      case "form": {
        try {
          const contentType2 = c.req.header("Content-Type");
          if (contentType2) {
            const arrayBuffer = c.req.bodyCache.arrayBuffer ?? await c.req.raw.arrayBuffer();
            const formData = await bufferToFormData(arrayBuffer, contentType2);
            const form = {};
            formData.forEach((value2, key) => {
              form[key] = value2;
            });
            value = form;
            c.req.bodyCache.formData = formData;
            c.req.bodyCache.arrayBuffer = arrayBuffer;
          }
        } catch (e) {
          let message = "Malformed FormData request.";
          message += e instanceof Error ? ` ${e.message}` : ` ${String(e)}`;
          return c.json(
            {
              success: false,
              message
            },
            400
          );
        }
        break;
      }
      case "query":
        value = Object.fromEntries(
          Object.entries(c.req.queries()).map(([k, v]) => {
            return v.length === 1 ? [k, v[0]] : [k, v];
          })
        );
        break;
      case "queries":
        value = c.req.queries();
        console.log("Warnings: Validate type `queries` is deprecated. Use `query` instead.");
        break;
      case "param":
        value = c.req.param();
        break;
      case "header":
        value = c.req.header();
        break;
      case "cookie":
        value = getCookie(c);
        break;
    }
    const res = await validationFunc(value, c);
    if (res instanceof Response) {
      return res;
    }
    c.req.addValidatedData(target, res);
    await next();
  };
};
export {
  validator
};
