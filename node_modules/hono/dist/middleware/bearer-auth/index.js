// src/middleware/bearer-auth/index.ts
import { HTTPException } from "../../http-exception.js";
import { timingSafeEqual } from "../../utils/buffer.js";
var TOKEN_STRINGS = "[A-Za-z0-9._~+/-]+=*";
var PREFIX = "Bearer";
var bearerAuth = (options) => {
  if (!options.token) {
    throw new Error('bearer auth middleware requires options for "token"');
  }
  if (!options.realm) {
    options.realm = "";
  }
  if (!options.prefix) {
    options.prefix = PREFIX;
  }
  const realm = options.realm?.replace(/"/g, '\\"');
  return async function bearerAuth2(c, next) {
    const headerToken = c.req.header("Authorization");
    if (!headerToken) {
      const res = new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": `${options.prefix} realm="` + realm + '"'
        }
      });
      throw new HTTPException(401, { res });
    } else {
      const regexp = new RegExp("^" + options.prefix + " +(" + TOKEN_STRINGS + ") *$");
      const match = regexp.exec(headerToken);
      if (!match) {
        const res = new Response("Bad Request", {
          status: 400,
          headers: {
            "WWW-Authenticate": `${options.prefix} error="invalid_request"`
          }
        });
        throw new HTTPException(400, { res });
      } else {
        let equal = false;
        if (typeof options.token === "string") {
          equal = await timingSafeEqual(options.token, match[1], options.hashFunction);
        } else if (Array.isArray(options.token) && options.token.length > 0) {
          for (const token of options.token) {
            if (await timingSafeEqual(token, match[1], options.hashFunction)) {
              equal = true;
              break;
            }
          }
        }
        if (!equal) {
          const res = new Response("Unauthorized", {
            status: 401,
            headers: {
              "WWW-Authenticate": `${options.prefix} error="invalid_token"`
            }
          });
          throw new HTTPException(401, { res });
        }
      }
    }
    await next();
  };
};
export {
  bearerAuth
};
