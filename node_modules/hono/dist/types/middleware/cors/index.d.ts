import type { MiddlewareHandler } from '../../types';
type CORSOptions = {
    origin: string | string[] | ((origin: string) => string | undefined | null);
    allowMethods?: string[];
    allowHeaders?: string[];
    maxAge?: number;
    credentials?: boolean;
    exposeHeaders?: string[];
};
export declare const cors: (options?: CORSOptions) => MiddlewareHandler;
export {};
