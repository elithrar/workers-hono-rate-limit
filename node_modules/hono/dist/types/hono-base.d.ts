import { Context } from './context';
import type { ExecutionContext } from './context';
import type { Router } from './router';
import type { Env, ErrorHandler, H, HandlerInterface, MiddlewareHandlerInterface, NotFoundHandler, OnHandlerInterface, MergePath, MergeSchemaPath, FetchEventLike, Schema, RouterRoute } from './types';
export declare const COMPOSED_HANDLER: unique symbol;
type GetPath<E extends Env> = (request: Request, options?: {
    env?: E['Bindings'];
}) => string;
export type HonoOptions<E extends Env> = {
    strict?: boolean;
    router?: Router<[H, RouterRoute]>;
    getPath?: GetPath<E>;
};
declare const Hono_base: new <E_1 extends Env = Env, S_1 extends Schema = {}, BasePath_1 extends string = "/">() => {
    all: HandlerInterface<E_1, "all", S_1, BasePath_1>;
    options: HandlerInterface<E_1, "options", S_1, BasePath_1>;
    get: HandlerInterface<E_1, "get", S_1, BasePath_1>;
    post: HandlerInterface<E_1, "post", S_1, BasePath_1>;
    put: HandlerInterface<E_1, "put", S_1, BasePath_1>;
    delete: HandlerInterface<E_1, "delete", S_1, BasePath_1>;
    patch: HandlerInterface<E_1, "patch", S_1, BasePath_1>;
} & {
    on: OnHandlerInterface<E_1, S_1, BasePath_1>;
} & {
    use: MiddlewareHandlerInterface<E_1, S_1, BasePath_1>;
};
declare class Hono<E extends Env = Env, S extends Schema = {}, BasePath extends string = '/'> extends Hono_base<E, S, BasePath> {
    #private;
    router: Router<[H, RouterRoute]>;
    readonly getPath: GetPath<E>;
    private _basePath;
    routes: RouterRoute[];
    constructor(options?: HonoOptions<E>);
    private clone;
    private notFoundHandler;
    private errorHandler;
    route<SubPath extends string, SubEnv extends Env, SubSchema extends Schema, SubBasePath extends string>(path: SubPath, app?: Hono<SubEnv, SubSchema, SubBasePath>): Hono<E, MergeSchemaPath<SubSchema, MergePath<BasePath, SubPath>> & S, BasePath>;
    basePath<SubPath extends string>(path: SubPath): Hono<E, S, MergePath<BasePath, SubPath>>;
    onError: (handler: ErrorHandler<E>) => this;
    notFound: (handler: NotFoundHandler<E>) => this;
    /**
     * @deprecated
     * Use `showRoutes()` utility methods provided by 'hono/dev' instead of `app.showRoutes()`.
     * `app.showRoutes()` will be removed in v4.
     * @example
     * You could rewrite `app.showRoutes()` as follows
     * import { showRoutes } from 'hono/dev'
     * showRoutes(app)
     */
    showRoutes(): void;
    mount(path: string, applicationHandler: (request: Request, ...args: any) => Response | Promise<Response>, optionHandler?: (c: Context) => unknown): Hono<E, S, BasePath>;
    /**
     * @deprecated
     * `app.routerName()` will be removed in v4.
     * Use `getRouterName()` in `hono/dev` instead of `app.routerName()`.
     */
    get routerName(): string;
    /**
     * @deprecated
     * `app.head()` is no longer used.
     * `app.get()` implicitly handles the HEAD method.
     */
    head: () => this;
    private addRoute;
    private matchRoute;
    private handleError;
    private dispatch;
    /**
     * @deprecated
     * `app.handleEvent()` will be removed in v4.
     * Use `app.fetch()` instead of `app.handleEvent()`.
     */
    handleEvent: (event: FetchEventLike) => Response | Promise<Response>;
    fetch: (request: Request, Env?: E['Bindings'] | {}, executionCtx?: ExecutionContext) => Response | Promise<Response>;
    request: (input: RequestInfo | URL, requestInit?: RequestInit, Env?: E['Bindings'] | {}, executionCtx?: ExecutionContext) => Response | Promise<Response>;
    fire: () => void;
}
export { Hono as HonoBase };
