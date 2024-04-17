// src/utils/jwt/jwt.ts
import { encodeBase64Url, decodeBase64Url } from "../../utils/encode.js";
import { JwtTokenIssuedAt } from "./types.js";
import {
  JwtTokenInvalid,
  JwtTokenNotBefore,
  JwtTokenExpired,
  JwtTokenSignatureMismatched,
  JwtAlgorithmNotImplemented
} from "./types.js";
var utf8Encoder = new TextEncoder();
var utf8Decoder = new TextDecoder();
var encodeJwtPart = (part) => encodeBase64Url(utf8Encoder.encode(JSON.stringify(part))).replace(/=/g, "");
var encodeSignaturePart = (buf) => encodeBase64Url(buf).replace(/=/g, "");
var decodeJwtPart = (part) => JSON.parse(utf8Decoder.decode(decodeBase64Url(part)));
var param = (name) => {
  switch (name.toUpperCase()) {
    case "HS256":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-256"
        }
      };
    case "HS384":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-384"
        }
      };
    case "HS512":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-512"
        }
      };
    default:
      throw new JwtAlgorithmNotImplemented(name);
  }
};
var signing = async (data, secret, alg = "HS256") => {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  const utf8Encoder2 = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw" /* RAW */,
    utf8Encoder2.encode(secret),
    param(alg),
    false,
    ["sign" /* Sign */]
  );
  return await crypto.subtle.sign(param(alg), cryptoKey, utf8Encoder2.encode(data));
};
var sign = async (payload, secret, alg = "HS256") => {
  const encodedPayload = encodeJwtPart(payload);
  const encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
  const partialToken = `${encodedHeader}.${encodedPayload}`;
  const signaturePart = await signing(partialToken, secret, alg);
  const signature = encodeSignaturePart(signaturePart);
  return `${partialToken}.${signature}`;
};
var verify = async (token, secret, alg = "HS256") => {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  const { payload } = decode(token);
  const now = Math.floor(Date.now() / 1e3);
  if (payload.nbf && payload.nbf > now) {
    throw new JwtTokenNotBefore(token);
  }
  if (payload.exp && payload.exp <= now) {
    throw new JwtTokenExpired(token);
  }
  if (payload.iat && now < payload.iat) {
    throw new JwtTokenIssuedAt(now, payload.iat);
  }
  const signaturePart = tokenParts.slice(0, 2).join(".");
  const signature = await signing(signaturePart, secret, alg);
  const encodedSignature = encodeSignaturePart(signature);
  if (encodedSignature !== tokenParts[2]) {
    throw new JwtTokenSignatureMismatched(token);
  }
  return payload;
};
var decode = (token) => {
  try {
    const [h, p] = token.split(".");
    const header = decodeJwtPart(h);
    const payload = decodeJwtPart(p);
    return {
      header,
      payload
    };
  } catch (e) {
    throw new JwtTokenInvalid(token);
  }
};
export {
  decode,
  sign,
  verify
};
