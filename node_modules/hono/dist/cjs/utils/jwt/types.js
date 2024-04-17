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
var types_exports = {};
__export(types_exports, {
  AlgorithmTypes: () => AlgorithmTypes,
  JwtAlgorithmNotImplemented: () => JwtAlgorithmNotImplemented,
  JwtAlorithmNotImplemented: () => JwtAlorithmNotImplemented,
  JwtTokenExpired: () => JwtTokenExpired,
  JwtTokenInvalid: () => JwtTokenInvalid,
  JwtTokenIssuedAt: () => JwtTokenIssuedAt,
  JwtTokenNotBefore: () => JwtTokenNotBefore,
  JwtTokenSignatureMismatched: () => JwtTokenSignatureMismatched
});
module.exports = __toCommonJS(types_exports);
class JwtAlgorithmNotImplemented extends Error {
  constructor(alg) {
    super(`${alg} is not an implemented algorithm`);
    this.name = "JwtAlgorithmNotImplemented";
  }
}
const JwtAlorithmNotImplemented = JwtAlgorithmNotImplemented;
class JwtTokenInvalid extends Error {
  constructor(token) {
    super(`invalid JWT token: ${token}`);
    this.name = "JwtTokenInvalid";
  }
}
class JwtTokenNotBefore extends Error {
  constructor(token) {
    super(`token (${token}) is being used before it's valid`);
    this.name = "JwtTokenNotBefore";
  }
}
class JwtTokenExpired extends Error {
  constructor(token) {
    super(`token (${token}) expired`);
    this.name = "JwtTokenExpired";
  }
}
class JwtTokenIssuedAt extends Error {
  constructor(currentTimestamp, iat) {
    super(`Incorrect "iat" claim must be a older than "${currentTimestamp}" (iat: "${iat}")`);
    this.name = "JwtTokenIssuedAt";
  }
}
class JwtTokenSignatureMismatched extends Error {
  constructor(token) {
    super(`token(${token}) signature mismatched`);
    this.name = "JwtTokenSignatureMismatched";
  }
}
var AlgorithmTypes = /* @__PURE__ */ ((AlgorithmTypes2) => {
  AlgorithmTypes2["HS256"] = "HS256";
  AlgorithmTypes2["HS384"] = "HS384";
  AlgorithmTypes2["HS512"] = "HS512";
  return AlgorithmTypes2;
})(AlgorithmTypes || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AlgorithmTypes,
  JwtAlgorithmNotImplemented,
  JwtAlorithmNotImplemented,
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenIssuedAt,
  JwtTokenNotBefore,
  JwtTokenSignatureMismatched
});
