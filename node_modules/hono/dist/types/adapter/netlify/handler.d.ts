import type { Context } from 'https://edge.netlify.com/';
import type { Hono } from '../../hono';
export type Env = {
    Bindings: {
        context: Context;
    };
};
export declare const handle: (app: Hono<any, any>) => (req: Request, context: Context) => Response | Promise<Response>;
