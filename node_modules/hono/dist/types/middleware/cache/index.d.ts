import type { MiddlewareHandler } from '../../types';
export declare const cache: (options: {
    cacheName: string;
    wait?: boolean;
    cacheControl?: string;
}) => MiddlewareHandler;
