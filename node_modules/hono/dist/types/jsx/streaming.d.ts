import type { HtmlEscapedString } from '../utils/html';
import type { FC } from './index';
/**
 * @experimental
 * `Suspense` is an experimental feature.
 * The API might be changed.
 */
export declare const Suspense: FC<{
    fallback: any;
}>;
/**
 * @experimental
 * `renderToReadableStream()` is an experimental feature.
 * The API might be changed.
 */
export declare const renderToReadableStream: (str: HtmlEscapedString | Promise<HtmlEscapedString>) => ReadableStream<Uint8Array>;
