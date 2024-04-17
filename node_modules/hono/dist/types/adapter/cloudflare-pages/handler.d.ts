import { Hono } from '../../hono';
import type { Env, MiddlewareHandler } from '../../types';
type Params<P extends string = any> = Record<P, string | string[]>;
export type EventContext<Env = {}, P extends string = any, Data = {}> = {
    request: Request;
    functionPath: string;
    waitUntil: (promise: Promise<unknown>) => void;
    passThroughOnException: () => void;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    env: Env & {
        ASSETS: {
            fetch: typeof fetch;
        };
    };
    params: Params<P>;
    data: Data;
};
interface HandleInterface {
    (app: Hono<any, any, any>): (eventContext: EventContext) => Response | Promise<Response>;
    /** @deprecated
     * Use `app.basePath()` to set a sub path instead of passing the second argument.
     * The `handle` will have only one argument in v4.
     */
    <E extends Env, S extends {}, BasePath extends string>(app: Hono<E, S, BasePath>, path: string): (eventContext: EventContext) => Response | Promise<Response>;
}
export declare const handle: HandleInterface;
/**
 *
 * @description `serveStatic()` is for advanced mode:
 * https://developers.cloudflare.com/pages/platform/functions/advanced-mode/#set-up-a-function
 *
 */
export declare const serveStatic: () => MiddlewareHandler;
export {};
