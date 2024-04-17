import type { Result } from './router';
import type { Input, InputToDataByTarget, ParamKeys, ParamKeyToRecord, RemoveQuestion, UndefinedIfHavingQuestion, ValidationTargets, RouterRoute } from './types';
import type { BodyData, ParseBodyOptions } from './utils/body';
import type { Cookie } from './utils/cookie';
import type { UnionToIntersection } from './utils/types';
type Body = {
    json: any;
    text: string;
    arrayBuffer: ArrayBuffer;
    blob: Blob;
    formData: FormData;
};
type BodyCache = Partial<Body & {
    parsedBody: BodyData;
}>;
export declare class HonoRequest<P extends string = '/', I extends Input['out'] = {}> {
    #private;
    raw: Request;
    routeIndex: number;
    path: string;
    bodyCache: BodyCache;
    constructor(request: Request, path?: string, matchResult?: Result<[unknown, RouterRoute]>);
    param<P2 extends string = P>(key: RemoveQuestion<ParamKeys<P2>>): UndefinedIfHavingQuestion<ParamKeys<P2>>;
    param<P2 extends string = P>(): UnionToIntersection<ParamKeyToRecord<ParamKeys<P2>>>;
    private getDecodedParam;
    private getAllDecodedParams;
    private getParamValue;
    query(key: string): string | undefined;
    query(): Record<string, string>;
    queries(key: string): string[] | undefined;
    queries(): Record<string, string[]>;
    header(name: string): string | undefined;
    header(): Record<string, string>;
    /** @deprecated
     * Use Cookie Middleware instead of `c.req.cookie()`. The `c.req.cookie()` will be removed in v4.
     *
     * @example
     *
     * import { getCookie } from 'hono/cookie'
     * // ...
     * app.get('/', (c) => c.text(getCookie(c, 'cookie-name')))
     */
    cookie(key: string): string | undefined;
    /** @deprecated
     * Use Cookie Middleware instead of `c.req.cookie()`. The `c.req.cookie()` will be removed in v4.
     *
     * @example
     *
     * import { getCookie } from 'hono/cookie'
     * // ...
     * app.get('/', (c) => c.json(getCookie(c)))
     */
    cookie(): Cookie;
    parseBody<T extends BodyData = BodyData>(options?: ParseBodyOptions): Promise<T>;
    private cachedBody;
    json<T = any>(): Promise<T>;
    text(): Promise<string>;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    addValidatedData(target: keyof ValidationTargets, data: {}): void;
    valid<T extends keyof I & keyof ValidationTargets>(target: T): InputToDataByTarget<I, T>;
    get url(): string;
    get method(): string;
    get matchedRoutes(): RouterRoute[];
    get routePath(): string;
    /** @deprecated
     * Use `c.req.raw.headers` instead of `c.req.headers`. The `c.req.headers` will be removed in v4.
     * Or you can get the header values with using `c.req.header`.
     * @example
     *
     * app.get('/', (c) => {
     *   const userAgent = c.req.header('User-Agent')
     *   //...
     * })
     */
    get headers(): Headers;
    /** @deprecated
     * Use `c.req.raw.body` instead of `c.req.body`. The `c.req.body` will be removed in v4.
     */
    get body(): ReadableStream<Uint8Array> | null;
    /** @deprecated
     * Use `c.req.raw.bodyUsed` instead of `c.req.bodyUsed`. The `c.req.bodyUsed` will be removed in v4.
     */
    get bodyUsed(): boolean;
    /** @deprecated
     * Use `c.req.raw.integrity` instead of `c.req.integrity`. The `c.req.integrity` will be removed in v4.
     */
    get integrity(): string;
    /** @deprecated
     * Use `c.req.raw.keepalive` instead of `c.req.keepalive`. The `c.req.keepalive` will be removed in v4.
     */
    get keepalive(): boolean;
    /** @deprecated
     * Use `c.req.raw.referrer` instead of `c.req.referrer`. The `c.req.referrer` will be removed in v4.
     */
    get referrer(): string;
    /** @deprecated
     * Use `c.req.raw.signal` instead of `c.req.signal`. The `c.req.signal` will be removed in v4.
     */
    get signal(): AbortSignal;
}
export {};
