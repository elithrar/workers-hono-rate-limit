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
var jwt_exports = {};
__export(jwt_exports, {
  decode: () => decode,
  sign: () => sign,
  verify: () => verify
});
module.exports = __toCommonJS(jwt_exports);
var import_encode = require("../../utils/encode");
var import_types = require("./types");
var import_types2 = require("./types");
var CryptoKeyFormat = /* @__PURE__ */ ((CryptoKeyFormat2) => {
  CryptoKeyFormat2["RAW"] = "raw";
  CryptoKeyFormat2["PKCS8"] = "pkcs8";
  CryptoKeyFormat2["SPKI"] = "spki";
  CryptoKeyFormat2["JWK"] = "jwk";
  return CryptoKeyFormat2;
})(CryptoKeyFormat || {});
var CryptoKeyUsage = /* @__PURE__ */ ((CryptoKeyUsage2) => {
  CryptoKeyUsage2["Ecrypt"] = "encrypt";
  CryptoKeyUsage2["Decrypt"] = "decrypt";
  CryptoKeyUsage2["Sign"] = "sign";
  CryptoKeyUsage2["Verify"] = "verify";
  CryptoKeyUsage2["Deriverkey"] = "deriveKey";
  CryptoKeyUsage2["DeriveBits"] = "deriveBits";
  CryptoKeyUsage2["WrapKey"] = "wrapKey";
  CryptoKeyUsage2["UnwrapKey"] = "unwrapKey";
  return CryptoKeyUsage2;
})(CryptoKeyUsage || {});
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
const encodeJwtPart = (part) => (0, import_encode.encodeBase64Url)(utf8Encoder.encode(JSON.stringify(part))).replace(/=/g, "");
const encodeSignaturePart = (buf) => (0, import_encode.encodeBase64Url)(buf).replace(/=/g, "");
const decodeJwtPart = (part) => JSON.parse(utf8Decoder.decode((0, import_encode.decodeBase64Url)(part)));
const param = (name) => {
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
      throw new import_types2.JwtAlgorithmNotImplemented(name);
  }
};
const signing = async (data, secret, alg = "HS256") => {
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
const sign = async (payload, secret, alg = "HS256") => {
  const encodedPayload = encodeJwtPart(payload);
  const encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
  const partialToken = `${encodedHeader}.${encodedPayload}`;
  const signaturePart = await signing(partialToken, secret, alg);
  const signature = encodeSignaturePart(signaturePart);
  return `${partialToken}.${signature}`;
};
const verify = async (token, secret, alg = "HS256") => {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new import_types2.JwtTokenInvalid(token);
  }
  const { payload } = decode(token);
  const now = Math.floor(Date.now() / 1e3);
  if (payload.nbf && payload.nbf > now) {
    throw new import_types2.JwtTokenNotBefore(token);
  }
  if (payload.exp && payload.exp <= now) {
    throw new import_types2.JwtTokenExpired(token);
  }
  if (payload.iat && now < payload.iat) {
    throw new import_types.JwtTokenIssuedAt(now, payload.iat);
  }
  const signaturePart = tokenParts.slice(0, 2).join(".");
  const signature = await signing(signaturePart, secret, alg);
  const encodedSignature = encodeSignaturePart(signature);
  if (encodedSignature !== tokenParts[2]) {
    throw new import_types2.JwtTokenSignatureMismatched(token);
  }
  return payload;
};
const decode = (token) => {
  try {
    const [h, p] = token.split(".");
    const header = decodeJwtPart(h);
    const payload = decodeJwtPart(p);
    return {
      header,
      payload
    };
  } catch (e) {
    throw new import_types2.JwtTokenInvalid(token);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decode,
  sign,
  verify
});
