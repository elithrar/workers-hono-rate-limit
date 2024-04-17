import type { MiddlewareHandler } from '../../types';
declare const ENCODING_TYPES: readonly ["gzip", "deflate"];
interface CompressionOptions {
    encoding?: typeof ENCODING_TYPES[number];
}
export declare const compress: (options?: CompressionOptions) => MiddlewareHandler;
export {};
