import type { Context } from '../../context';
import type { MiddlewareHandler } from '../../types';
type IsAllowedOriginHandler = (origin: string, context: Context) => boolean;
interface CSRFOptions {
    origin?: string | string[] | IsAllowedOriginHandler;
}
export declare const csrf: (options?: CSRFOptions) => MiddlewareHandler;
export {};
