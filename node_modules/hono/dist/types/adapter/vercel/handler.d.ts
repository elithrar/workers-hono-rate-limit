import type { Hono } from '../../hono';
import type { FetchEventLike } from '../../types';
export declare const handle: (app: Hono<any, any, any>) => (req: Request, requestContext: FetchEventLike) => Response | Promise<Response>;
