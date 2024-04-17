import type { Env } from '../../types';
import type { ServeStaticOptions } from './serve-static';
declare const module: <E extends Env = Env>(options?: Omit<ServeStaticOptions<E>, "namespace">) => import("../../types").MiddlewareHandler;
export { module as serveStatic };
