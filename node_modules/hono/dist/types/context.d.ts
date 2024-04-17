import type { Runtime } from './helper/adapter';
import type { HonoRequest } from './request';
import type { Env, FetchEventLike, NotFoundHandler, Input, TypedResponse } from './types';
import type { CookieOptions } from './utils/cookie';
import type { StatusCode } from './utils/http-status';
import { StreamingApi } from './utils/stream';
import type { JSONValue, InterfaceToType, JSONParsed } from './utils/types';
type HeaderRecord = Record<string, string | string[]>;
type Data = string | ArrayBuffer | ReadableStream;
export interface ExecutionContext {
    waitUntil(promise: Promise<unknown>): void;
    passThroughOnException(): void;
}
export interface ContextVariableMap {
}
export interface ContextRenderer {
}
interface DefaultRenderer {
    (content: string | Promise<string>): Response | Promise<Response>;
}
export type Renderer = ContextRenderer extends Function ? ContextRenderer : DefaultRenderer;
interface Get<E extends Env> {
    <Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key];
    <Key extends keyof E['Variables']>(key: Key): E['Variables'][Key];
}
interface Set<E extends Env> {
    <Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void;
    <Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void;
}
interface NewResponse {
    (data: Data | null, status?: StatusCode, headers?: HeaderRecord): Response;
    (data: Data | null, init?: ResponseInit): Response;
}
interface BodyRespond extends NewResponse {
}
interface TextRespond {
    (text: string, status?: StatusCode, headers?: HeaderRecord): Response;
    (text: string, init?: ResponseInit): Response;
}
interface JSONRespond {
    <T>(object: InterfaceToType<T> extends JSONValue ? T : JSONValue, status?: StatusCode, headers?: HeaderRecord): Response & TypedResponse<InterfaceToType<T> extends JSONValue ? JSONValue extends InterfaceToType<T> ? never : JSONParsed<T> : never>;
    <T>(object: InterfaceToType<T> extends JSONValue ? T : JSONValue, init?: ResponseInit): Response & TypedResponse<InterfaceToType<T> extends JSONValue ? JSONValue extends InterfaceToType<T> ? never : JSONParsed<T> : never>;
}
interface HTMLRespond {
    (html: string | Promise<string>, status?: StatusCode, headers?: HeaderRecord): Response | Promise<Response>;
    (html: string | Promise<string>, init?: ResponseInit): Response | Promise<Response>;
}
type ContextOptions<E extends Env> = {
    env: E['Bindings'];
    executionCtx?: FetchEventLike | ExecutionContext | undefined;
    notFoundHandler?: NotFoundHandler<E>;
};
export declare const TEXT_PLAIN = "text/plain; charset=UTF-8";
export declare class Context<E extends Env = any, P extends string = any, I extends Input = {}> {
    #private;
    req: HonoRequest<P, I['out']>;
    env: E['Bindings'];
    private _var;
    finalized: boolean;
    error: Error | undefined;
    private renderer;
    private notFoundHandler;
    constructor(req: HonoRequest<P, I['out']>, options?: ContextOptions<E>);
    get event(): FetchEventLike;
    get executionCtx(): ExecutionContext;
    get res(): Response;
    set res(_res: Response | undefined);
    render: Renderer;
    setRenderer: (renderer: Renderer) => void;
    header: (name: string, value: string | undefined, options?: {
        append?: boolean;
    }) => void;
    status: (status: StatusCode) => void;
    set: Set<E>;
    get: Get<E>;
    get var(): Readonly<E['Variables'] & ContextVariableMap>;
    newResponse: NewResponse;
    body: BodyRespond;
    text: TextRespond;
    json: JSONRespond;
    /**
     * @deprecated
     * `c.jsonT()` will be removed in v4.
     * Use `c.json()` instead of `c.jsonT()`.
     * `c.json()` now returns data type, so you can just replace `c.jsonT()` to `c.json()`.
     */
    jsonT: JSONRespond;
    html: HTMLRespond;
    redirect: (location: string, status?: StatusCode) => Response;
    /** @deprecated
     * Use `streamText()` in `hono/streaming` instead of `c.streamText()`. The `c.streamText()` will be removed in v4.
     */
    streamText: (cb: (stream: StreamingApi) => Promise<void>, arg?: StatusCode | ResponseInit, headers?: HeaderRecord) => Response;
    /** @deprecated
     * Use `stream()` in `hono/streaming` instead of `c.stream()`. The `c.stream()` will be removed in v4.
     */
    stream: (cb: (stream: StreamingApi) => Promise<void>, arg?: StatusCode | ResponseInit, headers?: HeaderRecord) => Response;
    /** @deprecated
     * Use Cookie Middleware instead of `c.cookie()`. The `c.cookie()` will be removed in v4.
     *
     * @example
     *
     * import { setCookie } from 'hono/cookie'
     * // ...
     * app.get('/', (c) => {
     *   setCookie(c, 'key', 'value')
     *   //...
     * })
     */
    cookie: (name: string, value: string, opt?: CookieOptions) => void;
    notFound: () => Response | Promise<Response>;
    /** @deprecated
     * Use `getRuntimeKey()` exported from `hono/adapter` instead of `c.runtime()`. The `c.runtime()` will be removed in v4.
     *
     * @example
     *
     * import { getRuntimeKey } from 'hono/adapter'
     * // ...
     * app.get('/', (c) => {
     *   const key = getRuntimeKey()
     *   //...
     * })
     */
    get runtime(): Runtime;
}
export {};
