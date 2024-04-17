import type { MiddlewareHandler } from '../../types';
type ETagOptions = {
    retainedHeaders?: string[];
    weak?: boolean;
};
export declare const etag: (options?: ETagOptions) => MiddlewareHandler;
export {};
