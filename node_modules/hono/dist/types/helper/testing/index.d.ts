import type { Hono } from '../../hono';
type ExtractEnv<T> = T extends Hono<infer E, any, any> ? E : never;
export declare const testClient: <T extends Hono<any, any, any>>(app: T, Env?: {} | ExtractEnv<T>["Bindings"] | undefined, executionCtx?: any) => import("../../utils/types").UnionToIntersection<import("../../client/types").Client<T>>;
export {};
