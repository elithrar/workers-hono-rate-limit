export declare const METHOD_NAME_ALL: "ALL";
export declare const METHOD_NAME_ALL_LOWERCASE: "all";
export declare const METHODS: readonly ["get", "post", "put", "delete", "options", "patch"];
export declare const MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
export interface Router<T> {
    name: string;
    add(method: string, path: string, handler: T): void;
    match(method: string, path: string): Result<T>;
}
export type ParamIndexMap = Record<string, number>;
export type ParamStash = string[];
export type Params = Record<string, string>;
export type Result<T> = [[T, ParamIndexMap][], ParamStash] | [[T, Params][]];
export declare class UnsupportedPathError extends Error {
}
