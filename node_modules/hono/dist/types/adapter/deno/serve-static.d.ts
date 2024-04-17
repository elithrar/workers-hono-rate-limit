import type { Context } from '../../context';
import type { Env, MiddlewareHandler } from '../../types';
export type ServeStaticOptions<E extends Env = Env> = {
    root?: string;
    path?: string;
    rewriteRequestPath?: (path: string) => string;
    onNotFound?: (path: string, c: Context<E>) => void | Promise<void>;
};
export declare const serveStatic: <E extends Env = Env>(options?: ServeStaticOptions<E>) => MiddlewareHandler;
