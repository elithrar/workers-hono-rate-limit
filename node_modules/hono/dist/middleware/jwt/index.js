// src/middleware/jwt/index.ts
import { HTTPException } from "../../http-exception.js";
import { Jwt } from "../../utils/jwt/index.js";
import "../../context.js";
var jwt = (options) => {
  if (!options) {
    throw new Error('JWT auth middleware requires options for "secret');
  }
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  return async function jwt2(ctx, next) {
    const credentials = ctx.req.headers.get("Authorization");
    let token;
    if (credentials) {
      const parts = credentials.split(/\s+/);
      if (parts.length !== 2) {
        throw new HTTPException(401, {
          res: unauthorizedResponse({
            ctx,
            error: "invalid_request",
            errDescription: "invalid credentials structure"
          })
        });
      } else {
        token = parts[1];
      }
    } else if (options.cookie) {
      token = ctx.req.cookie(options.cookie);
    }
    if (!token) {
      throw new HTTPException(401, {
        res: unauthorizedResponse({
          ctx,
          error: "invalid_request",
          errDescription: "no authorization included in request"
        })
      });
    }
    let payload;
    let msg = "";
    try {
      payload = await Jwt.verify(token, options.secret, options.alg);
    } catch (e) {
      msg = `${e}`;
    }
    if (!payload) {
      throw new HTTPException(401, {
        res: unauthorizedResponse({
          ctx,
          error: "invalid_token",
          statusText: msg,
          errDescription: "token verification failure"
        })
      });
    }
    ctx.set("jwtPayload", payload);
    await next();
  };
};
function unauthorizedResponse(opts) {
  return new Response("Unauthorized", {
    status: 401,
    statusText: opts.statusText,
    headers: {
      "WWW-Authenticate": `Bearer realm="${opts.ctx.req.url}",error="${opts.error}",error_description="${opts.errDescription}"`
    }
  });
}
var verify = Jwt.verify;
var decode = Jwt.decode;
var sign = Jwt.sign;
export {
  decode,
  jwt,
  sign,
  verify
};
